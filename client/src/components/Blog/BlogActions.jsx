// src/components/Blog/BlogActions.jsx
import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function BlogActions({ type, blog, refresh }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [tempBlog, setTempBlog] = useState(blog);

  const blogRef = doc(db, "blogs", blog.id);

  // ---------------- LIKE / DISLIKE WITH SINGLE ACTION LOGIC ---------------- //
  async function likeBlog() {
    if (!currentUser) return navigate("/auth/login");

    const uid = currentUser.uid;
    const hasLiked = blog.likes?.includes(uid);
    const hasDisliked = blog.dislikes?.includes(uid);

    if (hasLiked) {
      // Remove like if user clicks again
      await updateDoc(blogRef, { likes: arrayRemove(uid) });
    } else {
      // Add like
      await updateDoc(blogRef, { likes: arrayUnion(uid) });

      // Remove dislike if previously disliked
      if (hasDisliked) {
        await updateDoc(blogRef, { dislikes: arrayRemove(uid) });
      }
    }

    refresh();
  }

  async function dislikeBlog() {
    if (!currentUser) return navigate("/auth/login");

    const uid = currentUser.uid;
    const hasLiked = blog.likes?.includes(uid);
    const hasDisliked = blog.dislikes?.includes(uid);

    if (hasDisliked) {
      // Remove dislike if user clicks again
      await updateDoc(blogRef, { dislikes: arrayRemove(uid) });
    } else {
      // Add dislike
      await updateDoc(blogRef, { dislikes: arrayUnion(uid) });

      // Remove like if previously liked
      if (hasLiked) {
        await updateDoc(blogRef, { likes: arrayRemove(uid) });
      }
    }

    refresh();
  }

  // ---------------- EDIT BLOG ---------------- //
  async function saveChanges() {
    await updateDoc(blogRef, {
      title: tempBlog.title,
      content: tempBlog.content,
      image: tempBlog.image,
      updatedAt: new Date(),
    });
    setEditMode(false);
    refresh();
  }

  async function deleteBlog() {
    if (confirm("Delete this blog?")) {
      await deleteDoc(blogRef);
      window.location.href = "/blog";
    }
  }

  // ---------------- UI RENDERING ---------------- //
  if (type === "likes") {
    const uid = currentUser?.uid;

    return (
      <div className="flex gap-4 mb-8">
        {/* LIKE BUTTON */}
        <button
          onClick={likeBlog}
          className={`px-4 py-2 rounded 
            ${uid && blog.likes?.includes(uid)
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white"}`}
        >
          👍 Like ({blog.likes?.length || 0})
        </button>

        {/* DISLIKE BUTTON */}
        <button
          onClick={dislikeBlog}
          className={`px-4 py-2 rounded 
            ${uid && blog.dislikes?.includes(uid)
              ? "bg-orange-700 text-white"
              : "bg-orange-500 text-white"}`}
        >
          👎 Dislike ({blog.dislikes?.length || 0})
        </button>
      </div>
    );
  }

  // ------ Only author sees edit/delete ------ //
  if (type === "edit-delete") {
    if (editMode) {
      return (
        <div className="p-4 bg-gray-100 rounded-md mb-10">
          <input
            className="border p-2 w-full mb-3"
            value={tempBlog.title}
            onChange={(e) => setTempBlog({ ...tempBlog, title: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-3"
            rows="5"
            value={tempBlog.content}
            onChange={(e) =>
              setTempBlog({ ...tempBlog, content: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Cover Image URL"
            value={tempBlog.image}
            onChange={(e) =>
              setTempBlog({ ...tempBlog, image: e.target.value })
            }
          />

          <div className="flex gap-3">
            <button
              onClick={saveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setEditMode(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={deleteBlog}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    );
  }

  return null;
}
