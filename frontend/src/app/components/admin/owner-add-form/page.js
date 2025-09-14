'use client'

import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"
import AdminLayout from "../common/page"

import { useRouter } from "next/navigation"

export default function OwnerAddForm() {
  const router = useRouter()

  return (
    <>
      {/* Header + Sidebar */}
      <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminHeader />

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Add New Owner
              </h2>

              <form className="space-y-4">
                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter owner name"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  />
                </div>

                {/* Email + Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
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
                    placeholder="Enter shop address"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  ></textarea>
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

                  {/* Green View Owner List Button */}
                  <button
                    type="button"
                    onClick={() => router.push("/components/admin/owners")}
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
    </>
  )
}
