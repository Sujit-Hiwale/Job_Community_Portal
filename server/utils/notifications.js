import { db, admin } from "../config/firebase.js";

export const createNotification = (
  userId, title, message, type, metaRef = null, redirectUrl = null
) =>
  db.collection("notifications").add({
    userId,
    title,
    message,
    type,
    metaRef,
    redirectUrl,
    status: "unread",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });