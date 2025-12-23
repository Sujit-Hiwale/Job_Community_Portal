import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUserFromBackend } = useAuth(); // 👈 IMPORTANT
  const navigate = useNavigate();

  // ---------------- EMAIL LOGIN ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Firebase login
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Get token
      const token = await cred.user.getIdToken();

      // 3️⃣ Login to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 4️⃣ Store backend profile globally
      setUserFromBackend(res.data.profile);

      navigate("/blog");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or account not found");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserFromBackend(res.data.profile);

      navigate("/blog");
    } catch (err) {
      console.error(err);
      setError("Google Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 border py-2 rounded flex justify-center gap-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
