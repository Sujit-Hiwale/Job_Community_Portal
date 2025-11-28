import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Briefcase, Building2, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState({ role: "", location: "" });
  const [latestJobs, setLatestJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Software",
    "Marketing",
    "Finance",
    "HR",
    "Sales",
    "Engineering",
    "Healthcare",
    "Remote",
  ];

  // 🔹 Fetch latest jobs on page load
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/jobs/latest");
        setLatestJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // 🔹 Search Handler
  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/search-jobs", {
        params: {
          role: search.role,
          location: search.location,
        },
      });
      setFilteredJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Category filter
  const filterByCategory = async (cat) => {
    try {
      const res = await axios.get("http://localhost:5000/search-jobs", {
        params: { role: cat },
      });
      setFilteredJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition">

        {/* ============ HERO SECTION ============ */}
        <section className="bg-blue-50 dark:bg-gray-800 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-10 md:h-[550px] py-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Your <span className="text-blue-600">Dream Job</span> Today
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
              Explore thousands of jobs from top companies.
            </p>

            {/* Search */}
            <div className="mt-8 w-full flex justify-center">
              <div className="bg-white dark:bg-gray-700 shadow-lg p-6 rounded-2xl w-full max-w-3xl flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Job Title, Role..."
                className="flex-1 p-3 rounded-lg border dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                value={search.role}
                onChange={(e) => setSearch({ ...search, role: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 p-3 rounded-lg border dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Search size={18} /> Search
              </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CATEGORIES ============ */}
        <section className="py-16 px-6 md:px-20">
          <h2 className="text-3xl font-bold text-center">Job Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => filterByCategory(cat)}
                className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-xl text-center hover:shadow-xl cursor-pointer transition"
              >
                <Briefcase className="mx-auto text-blue-600 mb-3" />
                <h3 className="font-semibold">{cat}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* ============ LATEST JOBS ============ */}
        <section className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center">Latest Jobs</h2>

          {loading ? (
            <p className="text-center mt-6">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center mt-6 text-gray-500">No jobs found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-700 p-6 shadow-md rounded-xl">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{job.company}</p>

                  <div className="mt-3 flex gap-3 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      {job.type}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-700 dark:text-gray-300">{job.salary || "Not disclosed"}</p>

                  <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-16 px-6 md:px-20">
          <h2 className="text-3xl font-bold text-center">Why Choose Us?</h2>

          <div className="grid md:grid-cols-4 gap-8 mt-10">
            {[
              { icon: <Briefcase />, title: "10,000+ Jobs", text: "Verified job postings" },
              { icon: <Building2 />, title: "5,000+ Companies", text: "Top recruiters hiring daily" },
              { icon: <Users />, title: "1-Click Apply", text: "Fast & easy application" },
              { icon: <ArrowRight />, title: "Smart Matching", text: "AI-powered suggestions" },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-xl text-center">
                <div className="mx-auto mb-3 text-blue-600">{item.icon}</div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}