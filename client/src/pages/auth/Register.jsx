import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig.js";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    role: "",
    companyName: "",
    position: "",
    experienceValue: "",
    experienceUnit: "years",
    cvUrl: "",
    certificatesUrl: "",
    gender: "",
    acceptTerms: false,
  });

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!isGoogleUser) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.password.trim())
        newErrors.password = "Password is required";
      if (formData.password.length < 6)
        newErrors.password = "At least 6 characters";
    }

    if (!formData.mobile.trim()) newErrors.mobile = "Mobile required";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Must be 10 digits";

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (formData.role === "company" && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required for company owners.";
    }

    if (!formData.role) newErrors.role = "Select a role";

    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.position.trim()) newErrors.position = "Position required";
    if (!formData.experienceValue)
      newErrors.experience = "Experience required";

    if (!formData.cvUrl.trim()) newErrors.cvUrl = "CV URL required";
    if (!formData.certificatesUrl.trim())
      newErrors.certificatesUrl = "Certificates URL required";

    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept the Terms & Conditions";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);

    try {
      let user = auth.currentUser;

      if (!isGoogleUser) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        user = userCredential.user;
        await sendEmailVerification(user);
      }

      const token = await user.getIdToken();

      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        role: formData.role,
        companyName: formData.companyName,
        position: formData.position,
        experience: {
          value: Number(formData.experienceValue),
          unit: formData.experienceUnit,
        },
        cvUrl: formData.cvUrl,
        certificatesUrl: formData.certificatesUrl,
        gender: formData.gender,
      };

      await axios.post("http://localhost:5000/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage(`Welcome ${formData.name}.\nIf you registered a new company, it is now pending admin approval.`);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.error || error.message || "Registration failed.",
      });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      setIsGoogleUser(true);

      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        password: "",
        role: "job-seeker",
      }));
    } catch (error) {
      setErrors({ submit: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Register</h2>

        {/* GOOGLE ACCOUNT INFO DISPLAY */}
        {isGoogleUser && (
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded border-l-4 border-blue-500">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Signed in via Google:</strong> {formData.name} ({formData.email})
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ONLY SHOW NAME AND EMAIL INPUT IF NOT GOOGLE USER */}
          {!isGoogleUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                {errors.email && <p className="text-red-500 dark:text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                {errors.password && <p className="text-red-500 dark:text-red-400 text-sm">{errors.password}</p>}
              </div>
            </>
          )}

          {/* COMPANY NAME FIRST */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.companyName && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.companyName}</p>
            )}
          </div>
          {formData.companyName.trim() !== "" && (
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
              If this is a new company, it will require admin approval.
            </p>
          )}

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Objective *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">Select Objective</option>
              <option value="job-seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="company">Company</option>
            </select>
            {errors.role && <p className="text-red-500 dark:text-red-400 text-sm">{errors.role}</p>}
          </div>

          {/* REST OF THE FORM — unchanged */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Mobile *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.mobile && <p className="text-red-500 dark:text-red-400 text-sm">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.address && <p className="text-red-500 dark:text-red-400 text-sm">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {errors.gender && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Role *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.position && <p className="text-red-500 dark:text-red-400 text-sm">{errors.position}</p>}
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Experience *</label>

            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                name="experienceValue"
                value={formData.experienceValue}
                onChange={handleChange}
                placeholder="Value"
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <select
                name="experienceUnit"
                value={formData.experienceUnit}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>

            {errors.experience && <p className="text-red-500 dark:text-red-400 text-sm">{errors.experience}</p>}
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">CV URL *</label>
            <input
              type="url"
              name="cvUrl"
              value={formData.cvUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.cvUrl && <p className="text-red-500 dark:text-red-400 text-sm">{errors.cvUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Certification URL *</label>
            <input
              type="url"
              name="certificatesUrl"
              value={formData.certificatesUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.certificatesUrl && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.certificatesUrl}</p>
            )}
          </div>

          {/* TERMS */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-900 dark:text-gray-100">
              I accept the Terms and Conditions *
            </label>
          </div>
          {errors.acceptTerms && <p className="text-red-500 dark:text-red-400 text-sm">{errors.acceptTerms}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 border border-gray-300 dark:border-gray-600 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-gray-900 dark:text-gray-100">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
