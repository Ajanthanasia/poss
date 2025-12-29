'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../header/page';
import AdminSidebar from '../sidebar/page';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EmployeesListPage() {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/'

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  const handleSearch = async (searchText, pageNum = 1) => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        `${apiUrl}/api/employees/search?query=${encodeURIComponent(searchText)}&page=${pageNum}&per_page=5`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json()

      if (res.ok && data.status) {
        setEmployees(data.data)
        setPage(data.page)
        setPages(data.pages)
        setTotal(data.total)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Search failed')
      }
    } catch (err) {
      console.error(err)
      setMessageType('error')
      setMessage('Something went wrong during search')
    }
  }

  const handleAddNewEmployee = () => {
    router.push("/components/admin/employee-add-form")
  }

  const fetchEmployees = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/employees/?page=${pageNum}&per_page=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok && data.status) {
        setEmployees(data.data)
        setPage(data.page)
        setPages(data.pages)
        setTotal(data.total)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to load employees')
      }
    } catch (err) {
      console.error(err)
      setMessageType('error')
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees(page)
  }, [page])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const deleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found. Please login again.')

      const res = await fetch(`${apiUrl}/api/employees/${employeeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await res.json()
      if (res.ok && data.status) {
        setEmployees(employees.filter(e => e.id !== employeeId))
        setMessageType('success')
        setMessage(data.message)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to delete employee')
      }
    } catch (err) {
      console.error(err)
      setMessageType('error')
      setMessage(err.message || 'Something went wrong')
    }
  }


  const viewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">

          {/* Top Heading and Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Employees List</h1>
            <button
              onClick={handleAddNewEmployee}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add Employee
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              className="px-3 py-2 border rounded w-full max-w-sm focus:outline-none focus:ring focus:border-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery)
              }}
            />

            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Search
            </button>

          </div>

          {message && messageType === 'error' && (
            <div className="mb-4 p-3 text-center rounded bg-red-500 text-white">
              {message}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-500">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-center">#</th>
                    <th className="py-3 px-4 text-center">Name</th>
                    <th className="py-3 px-4 text-center">Email</th>
                    <th className="py-3 px-4 text-center">Contact</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50 align-top">
                      <td className="py-1 px-4 text-center text-black">{index + 1}</td>
                      <td className="py-1 px-4 text-center font-medium text-black">{employee.name}</td>
                      <td className="py-1 px-4 text-center text-black">{employee.email}</td>
                      <td className="py-1 px-4 text-center text-black">{employee.country_code} {employee.contact}</td>
                      <td className="py-1 px-4 text-center text-black">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewEmployee(employee)}
                            className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                          >
                            <EyeIcon className="w-5 h-5 mx-auto" />
                          </button>
                          <button
                            onClick={() => router.push(`/employee/edit/${employee.id}`)}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <PencilSquareIcon className="w-5 h-5 mx-auto" />
                          </button>

                          <button
                            onClick={() => deleteEmployee(employee.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            <TrashIcon className="w-5 h-5 mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <span className="inline-flex items-center px-2 py-1 ring-1 ring-inset text-black text-sm font-medium rounded bg-gray-200">
                  Page {page} of {pages} (Total : {total})
                </span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50">Prev</button>
                  <button disabled={page === pages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* View Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{selectedEmployee.name}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{selectedEmployee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{selectedEmployee.country_code} {selectedEmployee.contact}</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 transition">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
