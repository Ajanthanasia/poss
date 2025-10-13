'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"

export default function OwnerAddForm() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/'; // your API base URL

    const [ownerName, setOwnerName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [countryCode, setCountryCode] = useState("+94")
    const [password, setPassword] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation including password
        if (!ownerName.trim() || !email.trim() || !contact.trim() || !password.trim()) {
            setErrorMsg("Please fill all required fields.")
            return
        }

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${apiUrl}/api/store-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    owner_name: ownerName,
                    email,
                    contact,
                    country_code: countryCode,
                    password   // send password to backend
                }),
            })

            if (res.ok) {
                setSuccessMsg("Owner added successfully.")
                setOwnerName("")
                setEmail("")
                setContact("")
                setCountryCode("+94")
                setPassword("")
                setErrorMsg("")
            } else {
                const err = await res.json().catch(() => ({}))
                setErrorMsg(err.message || "Something went wrong.")
                setSuccessMsg("")
            }
        } catch (err) {
            console.error(err)
            setErrorMsg("Network or server error.")
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

                {/* Center the form container */}
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Add New Owner
                            </h2>

                            {/* Messages */}
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

                            <form className="space-y-4" onSubmit={handleSubmit}>
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

                                {/* Password Field */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-3">
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/components/admin/owners")}
                                        className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition"
                                    >
                                        View Owner List
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
