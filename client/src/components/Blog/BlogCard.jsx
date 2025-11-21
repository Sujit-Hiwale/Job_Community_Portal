// src/components/Blog/BlogCard.jsx
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="block bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
    >
      {blog.image && (
        <img
          src={blog.image}
          alt="cover"
          className="w-full h-52 object-cover rounded-md mb-3"
        />
      )}

      <h2 className="text-xl font-semibold">{blog.title}</h2>
      <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>

      <p className="text-sm text-gray-500 mt-3">
        By {blog.authorName || "Anonymous"}
      </p>
    </Link>
  );
}