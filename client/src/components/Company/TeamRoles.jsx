import { useEffect, useState } from "react";
import axios from "axios";
import { UserCog } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ROLE_META = {
  owner: { label: "Owner", icon: "👑" },
  hr: { label: "HR Manager", icon: "👔" },
  recruiter: { label: "Recruiter", icon: "🎯" },
  assistant: { label: "Assistant", icon: "👤" },
};

export default function TeamRoles({ companyProfile }) {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyProfile?.companyId || !currentUser) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [currentUser]);

  async function fetchAll() {
    try {
      const token = await currentUser.getIdToken();

      const [teamRes, companyRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/company/${companyProfile.companyId}/team`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `http://localhost:5000/company/${companyProfile.companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      setTeam(teamRes.data.employees || []);
      setCompany(companyRes.data.company);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isOwner = company?.owners?.includes(currentUser.uid);

  async function changeRole(userId, newRole) {
    if (!isOwner) return;

    const token = await currentUser.getIdToken();

    await axios.put(
      "http://localhost:5000/company/update-user-role",
      { userId, newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTeam((prev) =>
      prev.map((m) =>
        m.uid === userId ? { ...m, companyRole: newRole } : m
      )
    );
  }

  async function removeMember(userId) {
    if (!confirm("Remove this member from company?")) return;

    const token = await currentUser.getIdToken();

    await axios.delete(
      `http://localhost:5000/company/${companyProfile.companyId}/team/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTeam((prev) => prev.filter((m) => m.uid !== userId));
  }

  if (loading) return <p>Loading team…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCog className="w-7 h-7 text-blue-600" />
        <h1 className="text-3xl font-bold">Team & Roles</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
        {team.map((m) => {
          const role = ROLE_META[m.companyRole];

          const canEdit =
            isOwner &&
            m.companyRole !== "owner" &&
            m.uid !== currentUser.uid;

          return (
            <div
              key={m.uid}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {canEdit ? (
                  <>
                    <select
                      value={m.companyRole}
                      onChange={(e) =>
                        changeRole(m.uid, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="employee">Employee</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="hr">HR Manager</option>
                    </select>

                    <button
                      onClick={() => removeMember(m.uid)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-sm font-medium">
                    {role.icon} {role.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
