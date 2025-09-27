'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"

export default function OwnerAddForm() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // ===== States =====
    const [ownerName, setOwnerName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [countryCode, setCountryCode] = useState("+94") // default country code
    const [shopName, setShopName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [shopCity, setShopCity] = useState("")
    const [shopDistrict, setShopDistrict] = useState("")
    const [shopCountry, setShopCountry] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    // ===== Submit Handler =====
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!ownerName.trim() || !email.trim() || !contact.trim() || !shopName.trim() || !shopAddress.trim()) {
            setErrorMsg("Please fill all required fields.")
            return
        }

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${apiUrl}/api/store-owner-shop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    owner_name: ownerName,
                    email,
                    contact,
                    country_code: countryCode,
                    shop_name: shopName,
                    shop_address: shopAddress,
                    city: shopCity,
                    district: shopDistrict,
                    country: shopCountry
                }),
            })

            if (res.ok) {
                setSuccessMsg("Owner and Shop added successfully.")
                setErrorMsg("")
                // Reset form
                setOwnerName("")
                setEmail("")
                setContact("")
                setCountryCode("+94")
                setShopName("")
                setShopAddress("")
                setShopCity("")
                setShopDistrict("")
                setShopCountry("")
            } else {
                let errMsg = "Something went wrong"
                try {
                    const err = await res.json()
                    errMsg = err.message || errMsg
                } catch {}
                setErrorMsg(errMsg)
                setSuccessMsg("")
            }

        } catch (error) {
            console.error(error)
            setErrorMsg("Network or server error.")
            setSuccessMsg("")
        }
    }

    // Auto hide messages
    useEffect(() => {
        if (successMsg || errorMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg("")
                setErrorMsg("")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMsg, errorMsg])

    // ===== UI =====
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

                        {/* Success / Error messages */}
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

                            {/* Email + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Email */}
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

                                {/* Country code + contact */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Phone
                                    </label>
                                    <div className="flex">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="border border-gray-300 rounded-l-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm bg-white"
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
                                            className="flex-1 border border-gray-300 rounded-r-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                                        />
                                    </div>
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
                                />
                            </div>

                            {/* City, District, Country */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={shopCity}
                                        onChange={(e) => setShopCity(e.target.value)}
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
                                        value={shopDistrict}
                                        onChange={(e) => setShopDistrict(e.target.value)}
                                        placeholder="Enter district"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={shopCountry}
                                        onChange={(e) => setShopCountry(e.target.value)}
                                        placeholder="Enter country"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-3">
                                <div className="flex gap-2">
                                    <button
                                        type="reset"
                                        onClick={() => {
                                            setOwnerName("")
                                            setEmail("")
                                            setContact("")
                                            setCountryCode("+94")
                                            setShopName("")
                                            setShopAddress("")
                                            setShopCity("")
                                            setShopDistrict("")
                                            setShopCountry("")
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
                                    className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition text-sm"
                                >
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
