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

      {/* Request Service Form */}
      <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Request a Service</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Fill out the form below and our team will contact you to discuss your requirements.</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); alert('Request sent (demo)') }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input name="name" required className="mt-1 block w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
            <input name="company" className="mt-1 block w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input name="email" type="email" required className="mt-1 block w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input name="phone" className="mt-1 block w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea name="message" rows={4} className="mt-1 block w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"></textarea>
          </div>

          <div className="md:col-span-2 text-right">
            <button type="submit" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Services
