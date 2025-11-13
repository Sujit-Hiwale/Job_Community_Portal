import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Job Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find your dream job or hire the best talent
        </p>
        
        <div className="flex justify-center gap-4">
          <Link 
            to="/auth/register" 
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link 
            to="/services" 
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-300 transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">For Job Seekers</h3>
          <p className="text-gray-600">
            Browse thousands of job opportunities and apply with ease.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">For Recruiters</h3>
          <p className="text-gray-600">
            Find qualified candidates quickly and efficiently.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">For Companies</h3>
          <p className="text-gray-600">
            Build your team with top talent from our platform.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
