import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs`
      );
      setJobs(res.data.jobs);
      setLoading(false);
    }
    loadJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
