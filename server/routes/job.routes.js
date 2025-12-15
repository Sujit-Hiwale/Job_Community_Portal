import express from "express";
import { db, admin } from "../config/firebase.js";
import { verifyToken, verifyTokenOptional } from "../middlewares/auth.js";
import { loadUserRole } from "../middlewares/roles.js";
import { createNotification } from "../utils/notifications.js";

const router = express.Router();

router.get("/jobs", async (req, res) => {
  try {
    const snapshot = await db.collection("jobs").orderBy("postedAt", "desc").get();
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load jobs" });
  }
});

router.get("/jobs/latest", async (req, res) => {
  try {
    const snapshot = await db.collection("jobs")
      .orderBy("postedAt", "desc")
      .limit(6)
      .get();

    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: "Failed to load latest jobs" });
  }
});

router.get("/jobs/:id", verifyTokenOptional, async (req, res) => {
  try {
    const snap = await db.collection("jobs").doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: "Job not found" });

    const job = snap.data();

    res.json({
      job: {
        id: snap.id,
        ...job,
        canEdit: req.uid
          ? job.createdBy === req.uid
          : false
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load job" });
  }
});

router.post("/jobs/create", verifyToken, loadUserRole, async (req, res) => {
  try {
    const uid = req.uid;

    if (req.user.role !== "recruiter" && req.user.role !== "company") {
      return res.status(403).json({ error: "Not allowed to create jobs" });
    }

    const { title, company, location, minSalary, maxSalary, type, workMode, description, category } = req.body;

    const newJob = {
      title,
      company,
      location,
      minSalary,
      maxSalary,
      type,
      workMode,
      description,
      category: category || null,
      postedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: uid,
      views: 0,
      savedBy: [],
      appliedBy: [],
    };

    const jobRef = await db.collection("jobs").add(newJob);

    return res.json({ success: true, id: jobRef.id });

  } catch (err) {
    console.error("Job creation error:", err);
    return res.status(500).json({ error: "Failed to create job" });
  }
});

router.put("/jobs/:id/edit", verifyToken, loadUserRole, async (req, res) => {
  try {
    const jobId = req.params.id;
    const uid = req.uid;

    const {
      title,
      description,
      company,
      location,
      minSalary,
      maxSalary,
      type,
      workMode,
      category
    } = req.body;

    const jobRef = db.collection("jobs").doc(jobId);
    const jobSnap = await jobRef.get();

    if (!jobSnap.exists)
      return res.status(404).json({ error: "Job not found" });

    const job = jobSnap.data();

    if (job.createdBy !== uid && req.user.role !== "admin" && req.user.role !== "super-admin") {
      return res.status(403).json({ error: "Access denied — Not allowed to edit this job" });
    }

    const updatedFields = {
      title: title ?? job.title,
      description: description ?? job.description,
      company: company ?? job.company,
      location: location ?? job.location,
      minSalary: minSalary ?? job.minSalary,
      maxSalary: maxSalary ?? job.maxSalary,
      type: type ?? job.type,
      workMode: workMode ?? job.workMode,
      category: category ?? job.category,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await jobRef.update(updatedFields);

    // Notify job owner
    await createNotification(
      uid,
      "Job Updated",
      `Your job '${updatedFields.title}' has been updated.`,
      "job-updated",
      jobId
    );

    return res.json({
      message: "Job updated successfully",
      updated: updatedFields
    });

  } catch (err) {
    console.error("Job update error:", err);
    return res.status(500).json({ error: "Failed to update job" });
  }
});

router.delete("/jobs/:id", verifyToken, loadUserRole, async (req, res) => {
  try {
    const jobId = req.params.id;
    const uid = req.uid;

    // Fetch job
    const jobRef = db.collection("jobs").doc(jobId);
    const jobSnap = await jobRef.get();

    if (!jobSnap.exists)
      return res.status(404).json({ error: "Job not found" });

    const job = jobSnap.data();

    // Check ownership or admin override
    if (job.createdBy !== uid && req.user.role !== "admin" && req.user.role !== "super-admin") {
      return res.status(403).json({ error: "Access denied — you cannot delete this job" });
    }

    // Delete job
    await jobRef.delete();

    // Notification to owner
    await createNotification(
      uid,
      "Job Deleted",
      `Your job '${job.title}' has been deleted.`,
      "job-deleted",
      jobId
    );

    return res.json({ message: "Job deleted successfully" });

  } catch (err) {
    console.error("Job deletion error:", err);
    return res.status(500).json({ error: "Failed to delete job" });
  }
});

router.put("/jobs/:id/apply", verifyToken, async (req, res) => {
  const jobRef = db.collection("jobs").doc(req.params.id);

  await jobRef.update({
    appliedBy: admin.firestore.FieldValue.arrayUnion(req.uid)
  });

  res.json({ success: true });
});

router.put("/jobs/:id/save", verifyToken, async (req, res) => {
  const jobRef = db.collection("jobs").doc(req.params.id);

  await jobRef.update({
    savedBy: admin.firestore.FieldValue.arrayUnion(req.uid)
  });

  res.json({ success: true });
});

router.put("/jobs/:id/view", async (req, res) => {
  try {
    const jobId = req.params.id;

    const jobRef = db.collection("jobs").doc(jobId);
    const snap = await jobRef.get();

    if (!snap.exists)
      return res.status(404).json({ error: "Job not found" });

    // Increment views safely
    await jobRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Job view error:", err);
    return res.status(500).json({ error: "Failed to increment view count" });
  }
});

router.get("/company/job-views/total", verifyToken, loadUserRole, async (req, res) => {
  try {
    const companyId = req.user.companyId;

    if (!companyId)
      return res.json({ totalViews: 0 });

    const jobsSnap = await db
      .collection("jobs")
      .where("company", "==", req.user.companyName)
      .get();

    let totalViews = 0;
    jobsSnap.docs.forEach(doc => {
      totalViews += doc.data().views || 0;
    });

    return res.json({ totalViews });
  } catch (err) {
    console.error("Job views fetch error:", err);
    return res.status(500).json({ error: "Failed to load job views" });
  }
});

router.get("/search-jobs", async (req, res) => {
  try {
    const { role = "", location = "" } = req.query;

    const snapshot = await db.collection("jobs").orderBy("postedAt", "desc").get();
    let jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Convert search to lowercase for flexible matching
    const r = role.toLowerCase();
    const l = location.toLowerCase();

    if (r.trim()) {
      jobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(r) ||
        job.company?.toLowerCase().includes(r) ||
        job.category?.toLowerCase().includes(r)
      );
    }

    if (l.trim()) {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(l)
      );
    }

    res.json({ jobs });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;