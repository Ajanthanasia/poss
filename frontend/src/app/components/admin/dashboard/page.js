'use client'
import AdminHeader from "../header/page"

import AdminSidebar from "../sidebar/page"
import AdminLayout from "../common/page"


export default function AdminDashboard() {
    return (
        <>
//             <div>
//                 <AdminHeader />
//                   <AdminSidebar />
//             </div>
            <AdminLayout>
                <div>
                    Welcome to Admin Dashboard
                </div>
            </AdminLayout>
        </>
    )
}