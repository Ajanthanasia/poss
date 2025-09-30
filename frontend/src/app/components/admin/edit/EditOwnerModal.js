'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '../header/page'
import AdminSidebar from '../sidebar/page'

export default function EditOwnerPage({ owner, onUpdated }) {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/'; // your API base URL

  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+94')
  const [contact, setContact] = useState('')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Load owner data when page loads
  useEffect(() => {
    if (!owner) return
    setOwnerName(owner.name || '')
    setEmail(owner.email || '')
    setCountryCode(owner.country_code || '+94')
    setContact(owner.contact || '')
    setSuccessMsg('')
    setErrorMsg('')
  }, [owner])

  // Auto-hide success/error messages after 3 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('')
        setErrorMsg('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg, errorMsg])

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!ownerName.trim() || !email.trim() || !contact.trim() || !countryCode.trim()) {
      setErrorMsg('Please fill all required fields.')
      setSuccessMsg('')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/store-owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner_id: owner.id,
          owner_name: ownerName,
          email,
          country_code: countryCode,
          contact,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg('Owner updated successfully.')
        setErrorMsg('')
        onUpdated?.()
      } else {
        setErrorMsg(data.message || 'Something went wrong.')
        setSuccessMsg('')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network or server error.')
      setSuccessMsg('')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Edit Owner</h2>

              {successMsg && (
                <div className="mb-4 p-3 text-center rounded bg-green-500 text-white font-medium transition-opacity duration-300">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 text-center rounded bg-red-500 text-white font-medium transition-opacity duration-300">
                  {errorMsg}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleUpdate}>
                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Enter owner name"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>

                {/* Phone: Country Code + Contact */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <div className="flex">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border border-gray-300 rounded-l-md px-3 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                    >
                      <option value="+94">+94</option>
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Contact number"
                      className="flex-1 border border-gray-300 rounded-r-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/components/admin/Owner-list')}
                    className="px-4 py-1.5 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
