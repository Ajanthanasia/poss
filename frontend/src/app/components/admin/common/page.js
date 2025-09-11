import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"
export default function AdminLayout({ children }) {
    return (
        <>
            {/* This is used to common dashboard to admin dashboard in here. in this setup has header and Sidebar */}
            <AdminHeader />
            <AdminSidebar />
            {children}
        </>
    )
}