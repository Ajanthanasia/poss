'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminHeader from '../header/page'
import AdminSidebar from '../sidebar/page'

export default function EditEmployeeModal() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+94')
  const [contact, setContact] = useState('')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch employee data on page load
  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok && data.status) {
        setName(data.data.name)
        setEmail(data.data.email)
        setCountryCode(data.data.country_code)
        setContact(data.data.contact)
      } else {
        setErrorMsg(data.message || 'Failed to load employee data')
      }
    }

    if (employeeId) fetchEmployee()
  }, [employeeId])

  // Auto-hide messages
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
    if (!name || !email || !contact || !countryCode) {
      setErrorMsg('Please fill all fields')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/employees/${employeeId}`, {
        method: 'PUT', // use PUT for updates
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_name: name,
          email,
          country_code: countryCode,
          contact,
        }),
      })
      const data = await res.json()
      if (res.ok && data.status) {
        setSuccessMsg('Employee updated successfully')
        setErrorMsg('')
      } else {
        setErrorMsg(data.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network or server error')
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
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Edit Employee</h2>

              {successMsg && <div className="mb-4 p-3 text-center rounded bg-green-500 text-white">{successMsg}</div>}
              {errorMsg && <div className="mb-4 p-3 text-center rounded bg-red-500 text-white">{errorMsg}</div>}

              <form className="space-y-4" onSubmit={handleUpdate}>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>

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
                <div className="flex justify-between items-center pt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/components/admin/employee')}
                    className="px-4 py-1.5 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700">
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
