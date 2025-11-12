import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Job Portal
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition"
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition"
            >
              Blog
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition"
            >
              Services
            </Link>
            <Link 
              to="/auth/login" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition"
            >
              Login
            </Link>
            <Link 
              to="/auth/register" 
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
