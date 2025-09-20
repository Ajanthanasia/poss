import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"
export default function AdminLayout({ children }) {
    return (
        <>
            {/* This is used to common dashboard to admin dashboard in here. in this setup has header and Sidebar */}
            <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <div className="flex flex-1">
                    <div className="w-64 bg-gray-800 text-white">
                        <AdminSidebar />
                    </div>
                    {/* Main Content */}
                    <main className="flex-1 p-6 bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}