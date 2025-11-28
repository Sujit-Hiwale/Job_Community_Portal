import { useState } from "react";
import { Search, Briefcase, Building2, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState({ role: "", location: "" });

  const categories = [
    "Software Development",
    "Marketing",
    "Finance",
    "Human Resources",
    "Sales",
    "Engineering",
    "Healthcare",
    "Remote Jobs",
  ];

  return (
    <div className="w-full">
      <div className="dark:bg-gray-900 dark:text-white w-full min-h-screen transition duration-300">
        
        {/* ================= HERO SECTION ================= */}
        <section className="
          bg-blue-50 dark:bg-gray-800
          px-6 md:px-20 
          flex flex-col md:flex-row 
          items-center justify-center 
          gap-10 
          md:h-[550px] py-10
        ">
          
          <div className="max-w-xl flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Find Your <span className="text-blue-600">Dream Job</span> Today
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
              Explore thousands of jobs from top companies. Apply with one click.
            </p>

            <div className="mt-8 bg-white dark:bg-gray-700 shadow-lg p-6 rounded-2xl w-full max-w-3xl flex flex-col md:flex-row items-center gap-4 mx-auto">
              <input
                type="text"
                placeholder="Job Title, Role..."
                className="flex-1 p-3 rounded-lg border dark:bg-gray-600 dark:border-gray-500 dark:text-white w-full"
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

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Search size={18} /> Search
              </button>
            </div>
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="py-16 px-6 md:px-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Job Categories</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">Browse jobs by popular categories</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {categories.map((cat) => (
              <div
                key={cat}
                className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-xl text-center hover:shadow-xl cursor-pointer transition"
              >
                <Briefcase className="mx-auto text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-white">{cat}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* ================= LATEST JOBS ================= */}
        <section className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Latest Jobs</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[1, 2, 3].map((job) => (
              <div key={job} className="bg-white dark:bg-gray-700 p-6 shadow-md rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frontend Developer</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Google Inc.</p>

                <div className="mt-3 flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Remote</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">Full-time</span>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300">₹8L - ₹12L per year</p>

                <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-16 px-6 md:px-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Why Choose Us?</h2>

          <div className="grid md:grid-cols-4 gap-8 mt-10">
            {[
              { icon: <Briefcase />, title: "10,000+ Jobs", text: "Verified job postings" },
              { icon: <Building2 />, title: "5,000+ Companies", text: "Top recruiters hiring daily" },
              { icon: <Users />, title: "1-Click Apply", text: "Fast & easy application" },
              { icon: <ArrowRight />, title: "Smart Matching", text: "AI-powered suggestions" },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-xl text-center">
                <div className="mx-auto mb-3 text-blue-600">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= NEWSLETTER ================= */}
        <section className="py-16 px-6 md:px-20 bg-blue-600 text-white text-center rounded-t-3xl">
          <h2 className="text-3xl font-bold">Stay Updated With New Jobs</h2>
          <p className="mt-2">Subscribe to get the latest job notifications</p>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg w-full max-w-md text-black"
            />
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900">Subscribe</button>
          </div>
        </section>

      </div>
    </div>
  );
}
