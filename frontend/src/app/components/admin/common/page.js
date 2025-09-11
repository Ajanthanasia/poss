import AdminHeader from "../header/page"
import AdminSidebar from "../sidebar/page"
export default function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            {children}
        </>
    )
}