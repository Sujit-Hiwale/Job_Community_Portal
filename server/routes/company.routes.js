import express from "express";
import { db, admin } from "../config/firebase.js";
import { verifyToken } from "../middlewares/auth.js";
import { loadUserRole, requireCompanyOwner } from "../middlewares/roles.js";

const router = express.Router();

router.get("/companies", async (req, res) => {
  try {
    const snapshot = await db.collection("companies").get();

    const companies = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Count employees
      const employeesSnap = await db
        .collection("companies")
        .doc(doc.id)
        .collection("employees")
        .get();

      // Count open jobs
      const jobsSnap = await db
        .collection("jobs")
        .where("company", "==", data.name)
        .get();

      companies.push({
        id: doc.id,
        name: data.name || "",
        logo: data.logoUrl || null,
        industry: data.industry || null,
        location: data.address || null,
        employeeCount: employeesSnap.size || 0,
        openJobs: jobsSnap.size || 0,
        followers: data.followers || 0,
        website: data.website || null,
      });
    }

    res.json({ companies });

  } catch (err) {
    console.error("Companies fetch error:", err);
    res.status(500).json({ error: "Failed to load companies" });
  }
});

router.get("/company/:id", async (req, res) => {
  try {
    const companyId = req.params.id;

    // 1️⃣ Fetch company
    const companyRef = db.collection("companies").doc(companyId);
    const companySnap = await companyRef.get();

    if (!companySnap.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    const company = { id: companySnap.id, ...companySnap.data() };

    // 2️⃣ Increment profile views safely
    await companyRef.update({
      profileViews: admin.firestore.FieldValue.increment(1)
    });

    // 3️⃣ Fetch employees
    const employeesSnap = await companyRef.collection("employees").get();

    const employees = employeesSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 4️⃣ Fetch open jobs
    const jobsSnap = await db
      .collection("jobs")
      .where("company", "==", company.name)
      .get();

    const jobs = jobsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 5️⃣ Build full response
    res.json({
      company: {
        id: company.id,
        name: company.name || "",
        logoUrl: company.logoUrl || null,
        owners: company.owners || [],
        status: company.status || "pending",
        address: company.address || null,
        description: company.description || "",
        website: company.website || null,
        profileViews: (company.profileViews || 0) + 1, // because we incremented it
        createdAt: company.createdAt || null,
        updatedAt: company.updatedAt || null,
      },
      employeesCount: employees.length,
      openJobs: jobs.length,
      employees,
      jobs,
    });

  } catch (err) {
    console.error("Company fetch error:", err);
    res.status(500).json({ error: "Server error fetching company" });
  }
});

router.get("/company/:id/analytics", async (req, res) => {
  try {
    const companyId = req.params.id;

    // 1️⃣ Fetch company
    const companySnap = await db.collection("companies").doc(companyId).get();
    if (!companySnap.exists) {
      return res.status(404).json({ error: "Company not found" });
    }
    const company = companySnap.data();

    // 2️⃣ Employees
    const employeesSnap = await db
      .collection("companies")
      .doc(companyId)
      .collection("employees")
      .get();

    const employees = employeesSnap.docs.map((d) => d.data());
    const employeeCount = employees.length;

    // Diversity metrics
    const gender = { male: 0, female: 0, other: 0 };
    const experience = { fresher: 0, mid: 0, senior: 0 };
    const remote = { onsite: 0, hybrid: 0, remote: 0 };

    employees.forEach((e) => {
      gender[e.gender] = (gender[e.gender] || 0) + 1;
      experience[e.experience?.level] =
        (experience[e.experience?.level] || 0) + 1;
      remote[e.workMode] = (remote[e.workMode] || 0) + 1;
    });

    // 3️⃣ Jobs and views
    const jobsSnap = await db
      .collection("jobs")
      .where("company", "==", company.name)
      .get();

    const jobs = jobsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const totalJobViews = jobs.reduce((acc, j) => acc + (j.views || 0), 0);
    const totalApplications = jobs.reduce(
      (acc, j) => acc + (j.appliedBy?.length || 0),
      0
    );

    // 4️⃣ Top performing jobs
    const topPerformingJobs = jobs
      .map((j) => ({
        title: j.title,
        views: j.views || 0,
        applications: j.appliedBy?.length || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);

    // 5️⃣ Monthly hiring trends → (fake values for now)
    const monthlyHiring = [2, 4, 1, 3, 5, 2, 4, 6, 3, 5, 2, 4];

    res.json({
      profileViews: company.profileViews || 0,
      jobViews: totalJobViews,
      totalApplications,
      topPerformingJobs,
      employeeGrowth: [2, 3, 6, 8, 11, employeeCount],
      monthlyHiring,
      diversityMetrics: { gender, experience, remote },
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
});

router.get("/company/:companyId/team", verifyToken, loadUserRole, async (req, res) => {
    try {
      const { companyId } = req.params;

      // 🔒 Ensure user belongs to this company
      if (req.user.companyId !== companyId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const employeesSnap = await db
        .collection("companies")
        .doc(companyId)
        .collection("employees")
        .get();

      const employees = employeesSnap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toMillis() || null,
      }));

      return res.json({ employees });
    } catch (err) {
      console.error("Fetch team error:", err);
      return res.status(500).json({ error: "Failed to load team" });
    }
  }
);

router.delete("/company/:companyId/team/:userId", verifyToken, loadUserRole, requireCompanyOwner, async (req, res) => {
    try {
      const { companyId, userId } = req.params;

      // must belong to same company
      if (req.user.companyId !== companyId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // ❌ cannot delete yourself
      if (req.uid === userId) {
        return res.status(400).json({ error: "You cannot remove yourself" });
      }

      const empRef = db
        .collection("companies")
        .doc(companyId)
        .collection("employees")
        .doc(userId);

      const empSnap = await empRef.get();

      if (!empSnap.exists) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const empData = empSnap.data();

      // ❌ cannot delete owner
      if (empData.companyRole === "owner") {
        return res.status(400).json({
          error: "Owner cannot be removed. Change role first.",
        });
      }

      // delete from company employees
      await empRef.delete();

      // update user doc
      await db.collection("users").doc(userId).update({
        companyId: null,
        companyName: null,
        companyRole: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("Remove member error:", err);
      return res.status(500).json({ error: "Failed to remove member" });
    }
  }
);

router.post("/company/profile/create", verifyToken, loadUserRole, requireCompanyOwner, async (req, res) => {
  try {
    const { companyName, logoUrl, website, description } = req.body;

    if (!companyName) return res.status(400).json({ error: "Company name required" });

    const docRef = await db.collection("companies").add({
      name: companyName,
      logoUrl: logoUrl || null,
      website: website || null,
      description: description || "",
      ownerId: req.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ success: true, companyId: docRef.id });
  } catch (err) {
    console.error("Company create error:", err);
    return res.status(500).json({ error: "Failed to create company profile" });
  }
});

router.get("/company/users", verifyToken, loadUserRole, requireCompanyOwner, async (req, res) => {
  try {
    const companyUsersSnap = await db
      .collection("users")
      .where("companyId", "==", req.user.companyId)
      .get();

    const users = companyUsersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({ users });
  } catch (err) {
    console.error("Company users fetch error:", err);
    return res.status(500).json({ error: "Failed to load employees" });
  }
});

router.put("/company/update-user-role",
  verifyToken, loadUserRole, requireCompanyOwner,
  async (req, res) => {
    try {
      const { userId, newRole } = req.body;

      if (!userId || !newRole)
        return res.status(400).json({ error: "Missing fields" });

      // Ensure the targeted user belongs to same company
      const targetSnap = await db.collection("users").doc(userId).get();
      if (!targetSnap.exists) return res.status(404).json({ error: "User not found" });

      const target = targetSnap.data();
      if (target.companyName !== req.user.companyName) {
        return res.status(403).json({ error: "You cannot modify someone outside your company" });
      }

      await db.collection("users").doc(userId).update({
        companyRole: newRole, // company-scoped role
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await createNotification(
        userId,
        "Company Role Updated",
        `Your company role has been changed to '${newRole}'.`,
        "company-role-updated"
      );

      return res.json({ success: true });
    } catch (err) {
      console.error("Company modify role error:", err);
      return res.status(500).json({ error: "Role change failed" });
    }
  }
);

router.put("/company/update", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const { name, address, description, logoUrl } = req.body;

    // 🔥 Find company where logged user is in owners array
    const companySnapshot = await db
      .collection("companies")
      .where("owners", "array-contains", uid)
      .limit(1)
      .get();

    if (companySnapshot.empty) {
      return res.status(404).json({ error: "No company found for this user OR user not owner" });
    }

    const companyRef = companySnapshot.docs[0].ref;

    // 🔐 Update company doc
    await companyRef.update({
      name: name?.trim(),
      address: address?.trim() || null,
      description: description?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ⭐ Update all employees who have this companyId
    const employeesSnap = await db
      .collection("users")
      .where("companyId", "==", companyRef.id)
      .get();

    const batch = db.batch();

    employeesSnap.docs.forEach(doc => {
      batch.update(doc.ref, {
        companyName: name?.trim(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.status(200).json({
      message: "Company updated successfully",
      companyId: companyRef.id
    });

  } catch (error) {
    console.error("Company update failed:", error);
    res.status(500).json({ error: "Server error updating company" });
  }
});

export default router;