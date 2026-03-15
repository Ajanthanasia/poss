'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import OwnerHeader from "./header"
// import OwnerAsideBar from "./aside"
import OwnerLayout from "../../layouts/page";

export default function ShopItemAddForm() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

    const [shopId, setShopId] = useState("")
    const [name, setName] = useState("")
    const [unitType, setUnitType] = useState("piece")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [qty, setQty] = useState("")
    const [statusId, setStatusId] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!shopId.trim() || !name.trim() || !price.trim() || !qty.trim()) {
            setErrorMsg("Please fill all required fields.")
            return
        }

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${apiUrl}/api/owns/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    shop_id: parseInt(shopId),
                    name,
                    unit_type: unitType,
                    description,
                    price: parseFloat(price),
                    qty: parseInt(qty),
                    status_id: statusId ? parseInt(statusId) : null
                }),
            })

            if (res.ok) {
                setSuccessMsg("Item added successfully.")
                // Reset form
                setShopId("")
                setName("")
                setUnitType("piece")
                setDescription("")
                setPrice("")
                setQty("")
                setStatusId("")
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
        <OwnerLayout>
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                            Add New Shop Item
                        </h2>

                        {/* Success Message */}
                        {successMsg && (
                            <div className="mb-4 p-3 text-center rounded bg-green-500 text-white font-medium transition-opacity duration-300">
                                {successMsg}
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="mb-4 p-3 text-center rounded bg-red-500 text-white font-medium transition-opacity duration-300">
                                {errorMsg}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Shop ID */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Shop ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={shopId}
                                    onChange={(e) => setShopId(e.target.value)}
                                    placeholder="Enter shop ID"
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                            </div>

                            {/* Item Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Item Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter item name"
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                            </div>

                            {/* Unit Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Unit Type
                                </label>
                                <select
                                    value={unitType}
                                    onChange={(e) => setUnitType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="piece">Piece</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter item description"
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
                                />
                            </div>

                            {/* Price and Quantity in Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Status ID */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Status ID
                                </label>
                                <input
                                    type="number"
                                    value={statusId}
                                    onChange={(e) => setStatusId(e.target.value)}
                                    placeholder="Enter status ID (optional)"
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-3">
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/components/owner/items")}
                                    className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition"
                                >
                                    View Item List
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </OwnerLayout>
        // <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
        //     <OwnerAsideBar />
        //     <div className="flex-1 flex flex-col">
        //         <OwnerHeader />

        //         <main className="flex-1 flex items-center justify-center p-6">
        //             <div className="w-full max-w-md">
        //                 <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        //                     <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        //                         Add New Shop Item
        //                     </h2>

        //                     {/* Success Message */}
        //                     {successMsg && (
        //                         <div className="mb-4 p-3 text-center rounded bg-green-500 text-white font-medium transition-opacity duration-300">
        //                             {successMsg}
        //                         </div>
        //                     )}

        //                     {/* Error Message */}
        //                     {errorMsg && (
        //                         <div className="mb-4 p-3 text-center rounded bg-red-500 text-white font-medium transition-opacity duration-300">
        //                             {errorMsg}
        //                         </div>
        //                     )}

        //                     <form className="space-y-4" onSubmit={handleSubmit}>
        //                         {/* Shop ID */}
        //                         <div>
        //                             <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                 Shop ID <span className="text-red-500">*</span>
        //                             </label>
        //                             <input
        //                                 type="number"
        //                                 value={shopId}
        //                                 onChange={(e) => setShopId(e.target.value)}
        //                                 placeholder="Enter shop ID"
        //                                 className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                             />
        //                         </div>

        //                         {/* Item Name */}
        //                         <div>
        //                             <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                 Item Name <span className="text-red-500">*</span>
        //                             </label>
        //                             <input
        //                                 type="text"
        //                                 value={name}
        //                                 onChange={(e) => setName(e.target.value)}
        //                                 placeholder="Enter item name"
        //                                 className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                             />
        //                         </div>

        //                         {/* Unit Type */}
        //                         <div>
        //                             <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                 Unit Type
        //                             </label>
        //                             <select
        //                                 value={unitType}
        //                                 onChange={(e) => setUnitType(e.target.value)}
        //                                 className="w-full border border-gray-300 rounded-md px-3 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                             >
        //                                 <option value="kg">Kilogram (kg)</option>
        //                                 <option value="l">Liter (l)</option>
        //                                 <option value="piece">Piece</option>
        //                             </select>
        //                         </div>

        //                         {/* Description */}
        //                         <div>
        //                             <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                 Description
        //                             </label>
        //                             <textarea
        //                                 value={description}
        //                                 onChange={(e) => setDescription(e.target.value)}
        //                                 placeholder="Enter item description"
        //                                 rows="3"
        //                                 className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
        //                             />
        //                         </div>

        //                         {/* Price and Quantity in Grid */}
        //                         <div className="grid grid-cols-2 gap-4">
        //                             <div>
        //                                 <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                     Price <span className="text-red-500">*</span>
        //                                 </label>
        //                                 <input
        //                                     type="number"
        //                                     step="0.01"
        //                                     value={price}
        //                                     onChange={(e) => setPrice(e.target.value)}
        //                                     placeholder="0.00"
        //                                     className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                                 />
        //                             </div>

        //                             <div>
        //                                 <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                     Quantity <span className="text-red-500">*</span>
        //                                 </label>
        //                                 <input
        //                                     type="number"
        //                                     value={qty}
        //                                     onChange={(e) => setQty(e.target.value)}
        //                                     placeholder="0"
        //                                     className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                                 />
        //                             </div>
        //                         </div>

        //                         {/* Status ID */}
        //                         <div>
        //                             <label className="block text-xs font-medium text-gray-600 mb-1">
        //                                 Status ID
        //                             </label>
        //                             <input
        //                                 type="number"
        //                                 value={statusId}
        //                                 onChange={(e) => setStatusId(e.target.value)}
        //                                 placeholder="Enter status ID (optional)"
        //                                 className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        //                             />
        //                         </div>

        //                         {/* Action Buttons */}
        //                         <div className="flex justify-between items-center pt-3">
        //                             <button
        //                                 type="submit"
        //                                 className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
        //                             >
        //                                 Submit
        //                             </button>
        //                             <button
        //                                 type="button"
        //                                 onClick={() => router.push("/components/owner/items")}
        //                                 className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition"
        //                             >
        //                                 View Item List
        //                             </button>
        //                         </div>
        //                     </form>
        //                 </div>
        //             </div>
        //         </main>
        //     </div>
        // </div>
    )
}