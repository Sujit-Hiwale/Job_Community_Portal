import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  if (userRole === "job-seeker")
    return <p className="p-6 text-red-600">You do not have permissions.</p>;

  async function submitBlog(e) {
    e.preventDefault();

    await axios.post(
      `${import.meta.env.VITE_API_URL}/blogs`,
      { title, content, image },
      {
        headers: {
          Authorization: `Bearer ${await currentUser.getIdToken()}`
        }
      }
    );

    navigate("/blog");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Blog</h1>

      <form onSubmit={submitBlog} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Cover image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          rows="8"
          placeholder="Blog content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          type="submit"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
