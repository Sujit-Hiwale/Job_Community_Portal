import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function CompanyEdit() {

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '',
    address: '',
    description: '',
    logoUrl: '',
  })

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = await currentUser.getIdToken()
        const res = await axios.get("http://localhost:5000/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.data?.company) {
          setError("No company data found.")
          return
        }

        setCompany(res.data.company)
        setForm({
          name: res.data.company.name || '',
          address: res.data.company.address || '',
          description: res.data.company.description || '',
          logoUrl: res.data.company.logoUrl || ''
        })

      } catch (err) {
        console.error("Error fetching company:", err)
        setError("Failed to load company data.")
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [currentUser])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSaveCompany = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const token = await currentUser.getIdToken()
      const res = await axios.put("http://localhost:5000/company/update", {
        name: form.name,
        address: form.address,
        description: form.description,
        logoUrl: form.logoUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess("Company updated successfully!")

      // Sync changes back to user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate("/profile")

    } catch (err) {
      console.error("Company update error:", err)
      setError("Failed to update company details")
    }
  }

  if (loading) return <p className="text-center mt-20">Loading company...</p>

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-4">Edit Company Profile</h2>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 px-4 py-2 rounded mb-3">{success}</p>}

      <form className="space-y-4" onSubmit={handleSaveCompany}>
        
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Logo URL</label>
          <input
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default CompanyEdit
