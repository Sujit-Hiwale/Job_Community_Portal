import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/blogs`
      );
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading blogs...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>

        {(userRole === "recruiter" ||
          userRole === "company" ||
          userRole === "admin" ||
          userRole === "super-admin") && (
          <Link
            to="/create-blog"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Blog
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blogs available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
