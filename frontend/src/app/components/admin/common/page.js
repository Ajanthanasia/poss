import AdminHeader from "../header/page"
export default function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />
            {children}
        </>
    )
}