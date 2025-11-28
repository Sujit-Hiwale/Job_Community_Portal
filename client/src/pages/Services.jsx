function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Job Matching</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Our advanced algorithm matches job seekers with the most relevant opportunities based on skills and experience.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Resume Building</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create professional resumes with our easy-to-use templates and get noticed by recruiters.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Recruiter Tools</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Access powerful tools to manage applications, schedule interviews, and communicate with candidates.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Career Guidance</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get expert advice on career development, interview preparation, and salary negotiation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Services
