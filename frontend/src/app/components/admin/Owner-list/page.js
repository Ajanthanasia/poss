'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '../header/page'
import AdminSidebar from '../sidebar/page'


export default function OwnersListPage() {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [selectedOwner, setSelectedOwner] = useState(null) // for View modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch owners
  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/index-owners`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setOwners(data.data)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to load owners')
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
    fetchOwners()
  }, [])

  // Delete owner
  const deleteOwner = async (ownerId) => {
    if (!window.confirm('Are you sure you want to delete this owner?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/delete-owner/${ownerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setOwners(owners.filter(o => o.id !== ownerId))
        setMessageType('success')
        setMessage(data.message)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to delete owner')
      }
    } catch (err) {
      console.error(err)
      setMessageType('error')
      setMessage('Something went wrong')
    }
  }

  // Open modal for viewing owner
  const viewOwner = (owner) => {
    setSelectedOwner(owner)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          
          {message && (
            <div className={`mb-4 p-3 text-center rounded ${messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {message}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading owners...</p>
          ) : owners.length === 0 ? (
            <p className="text-center text-gray-500">No owners found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-center w-1/6">Name</th>
                    <th className="py-3 px-4 text-center w-1/4">Email</th>
                    <th className="py-3 px-4 text-center w-1/5">Contact</th>
                    <th className="py-3 px-4 text-center w-1/3">Shops & Addresses</th>
                    <th className="py-3 px-4 text-center w-1/6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map(owner => (
                    <tr key={owner.id} className="border-b hover:bg-gray-50 align-top">
                      <td className="py-3 px-4 text-center font-medium">{owner.name}</td>
                      <td className="py-3 px-4 text-center">{owner.email}</td>
                      <td className="py-3 px-4 text-center">{owner.contact}</td>
                      <td className="py-3 px-4">
                        {owner.shops.length > 0 ? (
                          <ul className="space-y-2">
                            {owner.shops.map(shop => (
                              <li key={shop.id}>
                                <div className="font-medium">{shop.name}</div>
                                <div className="break-words whitespace-normal text-gray-600">{shop.full_address}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No shops</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col gap-2 items-center">
                          <button
                            onClick={() => viewOwner(owner)}
                            className="w-20 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/edit/${owner.id}`)}
                            className="w-20 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteOwner(owner.id)}
                            className="w-20 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* View Modal */}
        {isModalOpen && selectedOwner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{selectedOwner.name}</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{selectedOwner.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{selectedOwner.contact}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Shops & Addresses</h3>
                {selectedOwner.shops.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedOwner.shops.map(shop => (
                      <li key={shop.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="font-medium text-gray-800">{shop.name}</div>
                        <div className="text-gray-600 break-words">{shop.full_address}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No shops assigned</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
