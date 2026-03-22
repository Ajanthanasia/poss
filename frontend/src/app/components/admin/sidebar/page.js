'use client'
import { HomeIcon, BuildingStorefrontIcon, UsersIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function AdminSidebar({ role = 'admin', collapsed, onToggle }) {
    const router = useRouter()

    const menuItems = role === 'admin'
        ? [
            { name: 'Owners', icon: HomeIcon, path: '/components/admin/owners' },
            { name: 'Shops', icon: BuildingStorefrontIcon, path: '/components/admin/shops/index' },
            { name: 'Employees', icon: UsersIcon, path: '/components/admin/employee' },
        ]
        : [
            { name: 'Employees', icon: UsersIcon, path: '/components/owner/employees' },
            { name: 'Products', icon: ShoppingBagIcon, path: '/components/owner/products' },
        ]

    return (
        <div className={`h-screen bg-gray-800 text-white flex flex-col p-4 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} sticky top-0`}>
            <div className="flex items-center justify-between mb-8">
                {!collapsed && (
                    <h1 className="text-2xl font-bold">
                        {role === 'admin' ? 'Admin Dashboard' : 'Owner Dashboard'}
                    </h1>
                )}
                <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded">
                    {collapsed ? <Bars3Icon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
                </button>
            </div>
            <ul className="space-y-4">
                {menuItems.map((item, idx) => (
                    <li
                        key={idx}
                        onClick={() => router.push(item.path)}
                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
                        title={collapsed ? item.name : ''}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                    </li>
                ))}
            </ul>
        </div>
    )
}
