import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatBlogTime } from "../utils/date";
import { useAuth } from "../context/AuthContext";

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔒 If viewing own profile, redirect to private profile
    if (currentUser && currentUser.uid === userId) {
        navigate("/profile", { replace: true });
        return;
    }
    async function loadProfile() {
        try {
        const res = await axios.get(
            `http://localhost:5000/users/${userId}/profile`
        );

        setProfile(res.data.profile);
        setCompany(res.data.company || null);
        } catch (err) {
        console.error(err);
        setError("Profile not found");
        } finally {
        setLoading(false);
        }
    }

    loadProfile();
    }, [userId, currentUser, navigate]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${userId}/profile`
        );

        setProfile(res.data.profile);
        setCompany(res.data.company || null);
      } catch (err) {
        console.error(err);
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-4 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
          <div className="-mt-14 px-6 pb-6 flex items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {profile.name?.charAt(0)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.position && (
                <p className="text-gray-600">{profile.position}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company */}
        {company && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Company</p>
            <div className="flex items-center gap-4">
              {company.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt="Company Logo"
                  className="w-14 h-14 rounded-lg object-cover"
                />
              )}
              <h3
                onClick={() => navigate(`/company/${company.id}`)}
                className="text-xl font-semibold cursor-pointer hover:underline hover:text-blue-600 transition-colors"
              >
                {company.name}
              </h3>
            </div>
          </div>
        )}

        {/* Profile Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Information
            </h2>
            <div className="space-y-4">
              {profile?.email && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                </div>
              )}

              {profile?.mobile && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Mobile</p>
                    <p className="text-gray-900">{profile.mobile}</p>
                  </div>
                </div>
              )}

              {profile?.address && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="text-gray-900">{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Professional Details
            </h2>
            <div className="space-y-4">
              {profile?.position && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Position</p>
                    <p className="text-gray-900 font-semibold">{profile.position}</p>
                  </div>
                </div>
              )}

              {profile?.experience && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Experience</p>
                    <p className="text-gray-900">
                      {typeof profile.experience === "object"
                        ? `${profile.experience.value} ${profile.experience.unit}`
                        : profile.experience}
                    </p>
                  </div>
                </div>
              )}

              {profile?.gender && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Gender</p>
                    <p className="text-gray-900 capitalize">{profile.gender}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Member Since</p>
                  <p className="text-gray-900">
                    {profile?.createdAt
                      ? formatBlogTime(profile.createdAt)
                      : "Recently joined"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
}