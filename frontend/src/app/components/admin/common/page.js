'use client'
import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100 font-sans text-sm">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />

                {/* Page content */}
                <main className="flex-1 p-6 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    )
}
