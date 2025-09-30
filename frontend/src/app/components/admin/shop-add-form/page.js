'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "../sidebar/page"
import AdminHeader from "../header/page"

export default function ShopAddForm() {
  const router = useRouter()
  const [owners, setOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [form, setForm] = useState({
    owner_id: "",
    name: "",
    email: "",
    address: "",
    city: "",
    district: "",
    country: "",
  })

  useEffect(() => {
    fetch("http://localhost:5000/api/shop/owners")
      .then((res) => res.json())
      .then((data) => {
        setOwners(data)
        setLoadingOwners(false)
      })
      .catch((err) => {
        console.error("Failed to load owners", err)
        setLoadingOwners(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/shop/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (res.ok) {
        setSuccessMessage("✅ Shop added successfully!")
        setForm({
          owner_id: "",
          name: "",
          email: "",
          address: "",
          city: "",
          district: "",
          country: "",
        })
        setTimeout(() => {
          router.push("/components/admin/shops/index")
        }, 2000)
      } else {
        alert("❌ Error: " + result.error)
      }
    } catch (err) {
      console.error("Submit failed", err)
      alert("❌ Failed to submit form. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Add New Shop
            </h2>

            {/* ✅ Success Message Box */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-800 text-sm font-medium text-center shadow-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Owner Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Select Owner
                </label>
                <select
                  name="owner_id"
                  value={form.owner_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                >
                  <option value="">-- Select Owner --</option>
                  {loadingOwners ? (
                    <option disabled>Loading owners...</option>
                  ) : owners.length > 0 ? (
                    owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No owners found</option>
                  )}
                </select>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                />
              </div>

              {/* City + District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-3">
                <div className="flex gap-2">
                  <button
                    type="reset"
                    className="px-4 py-1.5 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition text-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition text-sm"
                  >
                    Submit
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/components/admin/shops/index")}
                  className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition text-sm"
                >
                  View Shops
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}