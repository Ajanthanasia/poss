'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EditEmployeeModal from '../../../components/admin/edit/EditEmployeeModal'

export default function EditEmployeePage() {
  const params = useParams()
  const employeeId = params?.id ?? params?.employeeId
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) {
        setError('Employee ID missing from route.')
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('No token found. Please login again.')
          setLoading(false)
          return
        }

       const url = `${apiUrl}/api/employees/${employeeId}`

        const res = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          mode: 'cors'
        })

        const text = await res.text()
        let data = null
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseErr) {
          setError(`Unexpected response from server (status ${res.status}). See console for details.`)
          setLoading(false)
          return
        }

        if (res.ok && data.data) {
          setEmployee(data.data)
          setIsModalOpen(true)
        } else {
          setError(data.message || `Employee not found (status ${res.status}).`)
        }
      } catch (err) {
        console.error('Fetch error', err)
        setError('Network error or CORS issue while fetching employee.')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId])

  if (loading) return <p className="p-6 text-center">Loading...</p>
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>

  return (
    <EditEmployeeModal
      isOpen={isModalOpen}
      employee={employee}
      onClose={() => router.push('/admin/employees')}
      onUpdated={() => console.log('Employee updated')}
    />
  )
}
