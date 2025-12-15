import express from "express";
import { admin, db } from "../config/firebase.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized - No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    let {
      name,
      email,
      mobile,
      address,
      role,
      companyName,
      position,
      experience,
      cvUrl,
      certificatesUrl,
      gender
    } = req.body;

    if (!name || !email || !mobile || !address || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const allowedGenders = ["male", "female", "other"];
    if (gender && !allowedGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ error: "Invalid gender value" });
    }
    
    if (
      !experience ||
      typeof experience !== "object" ||
      experience.value == null ||
      experience.unit == null
    ) {
      return res.status(400).json({ error: "Invalid experience format" });
    }

    companyName = companyName ? companyName.trim() : null;

    let companyId = null;
    let companyRole = "employee"; // default role

    if (companyName) {
      // Check if company exists
      const companySnap = await db
        .collection("companies")
        .where("name", "==", companyName)
        .limit(1)
        .get();

      if (!companySnap.empty) {
        const doc = companySnap.docs[0];
        const companyData = doc.data();
        companyId = doc.id;

        if (companyData.status === "rejected") {
            // treat like new request → create new pending
            return res.status(400).json({
              error: "This company was previously rejected. Create a new request with a different name."
            });
        }

        if (companyData.status === "pending") {
            companyRole = "employee"; // temporary
        }

        if (companyData.status === "accepted") {
            // your existing logic
        }
      } else {
        // Create new company
        const newCompanyRef = await db.collection("companies").add({
          name: companyName,
          logoUrl: null,
          owners: [uid],
          status: "pending",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        companyId = newCompanyRef.id;
        companyRole = "owner";
      }
    }

    // Create / update user record
    const userData = {
      name,
      email,
      mobile,
      address,
      role, // Global platform role
      companyName,
      companyId: companyId || null,
      companyRole, // Track employee or owner
      position,
      experience, // { value, unit }
      cvUrl: cvUrl || null,
      certificatesUrl: certificatesUrl || null,
      gender: gender || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).set(userData, { merge: true });

    // Ensure user is listed as employee under company
    if (companyId) {
      await db
        .collection("companies")
        .doc(companyId)
        .collection("employees")
        .doc(uid)
        .set({
          name,
          email,
          position,
          companyRole,
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    return res.json({
      message: "Registered successfully",
      companyAssigned: companyName || null,
      companyRole,
      companyId,
      firebaseUid: uid,
    });

  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token)
    return res.status(401).json({ error: "Unauthorized - No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    // 1️⃣ If UID does not exist in Firestore → check email instead
    if (!userDoc.exists) {
      const emailSnap = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      // 2️⃣ If Firestore user with same email already exists → use that
      if (!emailSnap.empty) {
        const existing = emailSnap.docs[0];
        return res.json({
          message: "Login Successful (email matched existing profile)",
          firebaseUid: existing.id,
          profile: existing.data(),
        });
      }

      // 3️⃣ Otherwise create new Firestore user
      const newUser = {
        name: decoded.name || "",
        email: email,
        role: "job-seeker",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.set(newUser);

      return res.json({
        message: "Google login successful - new profile created",
        firebaseUid: uid,
        profile: newUser,
      });
    }

    // 👍 Normal login path when UID already exists
    return res.json({
      message: "Login Successful",
      firebaseUid: uid,
      profile: userDoc.data(),
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;