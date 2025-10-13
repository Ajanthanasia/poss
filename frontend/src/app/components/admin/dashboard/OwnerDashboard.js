'use client'
import AdminHeader from '../header/page'
import AdminSidebar from '../sidebar/page'
import AdminLayout from '../common/page'

export default function OwnerDashboard() {
    return (
        <AdminLayout>
            <AdminHeader />
            <div className="flex">
                <AdminSidebar role="owner" />
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
                    <p>Welcome to the Owner Dashboard</p>
                    {/* Add Employees / Products content here */}
                </div>
            </div>
        </AdminLayout>
    )
}
