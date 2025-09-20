'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"

export default function OwnerAddForm() {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [contact, setContact] = useState("")
  const [shopName, setShopName] = useState("")
  const [shopAddress, setShopAddress] = useState("")

  // State for messages
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check all fields
    if (!ownerName.trim() || !email.trim() || !contact.trim() || !shopName.trim() || !shopAddress.trim()) {
      setErrorMsg("Please fill all fields.")
      return
    }

    try {
      const token = localStorage.getItem("token") // JWT from login

      const res = await fetch(`${apiUrl}/api/store-owner-shop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          owner_name: ownerName,
          contact,
          email,
          shop_name: shopName,
          shop_address: shopAddress
        }),
      })

      if (res.ok) {
        setSuccessMsg("Owner and Shop added successfully.")
        setErrorMsg("")

        // Clear all input fields
        setOwnerName("")
        setEmail("")
        setContact("")
        setShopName("")
        setShopAddress("")
      } else {
        let errMsg = "Something went wrong"
        try {
          const err = await res.json()
          errMsg = err.message || errMsg
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        setErrorMsg(errMsg)
        setSuccessMsg("")
      }
    } catch (error) {
      console.error(error)
      setErrorMsg("Something went wrong. Check console for details.")
      setSuccessMsg("")
    }
  }

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("")
        setErrorMsg("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg, errorMsg])

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Add New Owner
            </h2>

            {/* Messages */}
            {successMsg && (
              <div className="mb-4 p-3 text-center rounded bg-green-500 text-white font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-3 text-center rounded bg-red-500 text-white font-medium">
                {errorMsg}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Owner Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner name"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                />
              </div>

              {/* Email + Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter contact number"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Enter shop name"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                />
              </div>

              {/* Shop Address */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Shop Address
                </label>
                <textarea
                  rows="3"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  placeholder="Enter shop address"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-3">
                <div className="flex gap-2">
                  <button
                    type="reset"
                    onClick={() => {
                      setOwnerName("")
                      setEmail("")
                      setContact("")
                      setShopName("")
                      setShopAddress("")
                    }}
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
     onClick={() => router.push("/components/admin/Owner-list")}
      className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition text-sm">
     View Owner List
    </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
