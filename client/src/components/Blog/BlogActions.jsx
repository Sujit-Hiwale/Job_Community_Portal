import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BlogActions({ type, blog, refresh }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [tempBlog, setTempBlog] = useState(blog);

  async function authHeader() {
    return {
      headers: {
        Authorization: `Bearer ${await currentUser.getIdToken()}`
      }
    };
  }

  async function likeBlog() {
    if (!currentUser) return navigate("/auth/login");
    await axios.put(
      `${import.meta.env.VITE_API_URL}/blogs/${blog.id}/like`,
      {},
      await authHeader()
    );
    refresh();
  }

  async function dislikeBlog() {
    if (!currentUser) return navigate("/auth/login");
    await axios.put(
      `${import.meta.env.VITE_API_URL}/blogs/${blog.id}/dislike`,
      {},
      await authHeader()
    );
    refresh();
  }

  async function saveChanges() {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/blogs/${blog.id}/edit`,
      {
        title: tempBlog.title,
        content: tempBlog.content,
        image: tempBlog.image
      },
      await authHeader()
    );
    setEditMode(false);
    refresh();
  }

  async function deleteBlog() {
    if (!confirm("Delete this blog?")) return;
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/blogs/${blog.id}`,
      await authHeader()
    );
    navigate("/blog");
  }

  if (type === "likes") {
    const uid = currentUser?.uid;

    return (
      <div className="flex gap-4 mb-8">
        <button
          onClick={likeBlog}
          className={`px-4 py-2 rounded ${
            uid && blog.likes?.includes(uid)
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          👍 Like ({blog.likes?.length || 0})
        </button>

        <button
          onClick={dislikeBlog}
          className={`px-4 py-2 rounded ${
            uid && blog.dislikes?.includes(uid)
              ? "bg-orange-700 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          👎 Dislike ({blog.dislikes?.length || 0})
        </button>
      </div>
    );
  }

  if (type === "edit-delete") {
    if (editMode) {
      return (
        <div className="mb-10">
          <input
            className="border p-2 w-full mb-2"
            value={tempBlog.title}
            onChange={(e) =>
              setTempBlog({ ...tempBlog, title: e.target.value })
            }
          />
          <textarea
            className="border p-2 w-full mb-2"
            rows="5"
            value={tempBlog.content}
            onChange={(e) =>
              setTempBlog({ ...tempBlog, content: e.target.value })
            }
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Image URL"
            value={tempBlog.image || ""}
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
