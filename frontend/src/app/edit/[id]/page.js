'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EditOwnerModal from '../../components/admin/edit/EditOwnerModal'

export default function EditOwnerPage() {
  const params = useParams()
  const ownerId = params?.id ?? params?.ownerId // try both common names
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // basic sanity logs
    console.log('params', params)
    console.log('ownerId', ownerId)
    console.log('NEXT_PUBLIC_API_URL', apiUrl)

    const fetchOwner = async () => {
      if (!ownerId) {
        setError('Owner ID missing from route.')
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        console.log('token', !!token)

        if (!token) {
          setError('No token found. Please login again.')
          setLoading(false)
          return
        }

        const url = `${apiUrl}/api/index-owners/${ownerId}`
        console.log('fetching', url)

        const res = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          mode: 'cors' // explicit, in case your API is on another origin
        })

        console.log('response status', res.status, 'ok?', res.ok, 'content-type:', res.headers.get('content-type'))

        // read as text first so we can cope with HTML/error pages
        const text = await res.text()
        console.log('response text:', text)

        let data = null
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseErr) {
          console.warn('Failed to parse JSON from response:', parseErr)
          // show the raw text to help debugging
          setError(`Unexpected response from server (status ${res.status}). See console for details.`)
          setLoading(false)
          return
        }

        console.log('parsed data', data)

        if (res.ok && data.data) {
          const ownerData = { ...data.data, shops: data.data.shops ?? [] }
          setOwner(ownerData)
          setIsModalOpen(true)
        } else {
          // use server message if present
          setError(data.message || `Owner not found (status ${res.status}).`)
        }
      } catch (err) {
        console.error('Fetch error', err)
        setError('Network error or CORS issue while fetching owner. Check console/network tab.')
      } finally {
        setLoading(false)
      }
    }

    fetchOwner()
  }, [ownerId])

  if (loading) return <p className="p-6 text-center">Loading...</p>
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>

  return (
   
      <EditOwnerModal
        isOpen={isModalOpen}
        owner={owner}
        onClose={() => router.push('/admin/owners')}
        onUpdated={() => console.log('Owner updated')}
      />
  
  )
}
