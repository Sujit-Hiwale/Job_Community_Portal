import { db } from "../config/firebase.js";

export const loadUserRole = async (req, res, next) => {
  const snap = await db.collection("users").doc(req.uid).get();
  if (!snap.exists) return res.status(404).json({ error: "User not found" });
  req.user = snap.data();
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!["admin", "super-admin"].includes(req.user.role))
    return res.status(403).json({ error: "Admin only" });
  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super-admin")
    return res.status(403).json({ error: "Super Admin only" });
  next();
};

export const requireCompanyOwner = (req, res, next) => {
  if (req.user.companyRole !== "owner")
    return res.status(403).json({ error: "Company owner only" });
  next();
};