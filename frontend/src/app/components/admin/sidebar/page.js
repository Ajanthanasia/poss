'use client'
import { HomeIcon, BuildingStorefrontIcon, UsersIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function AdminSidebar({ role = 'admin' }) {
    const router = useRouter()

    const menuItems = role === 'admin'
        ? [
            { name: 'Owners', icon: HomeIcon, path: '/components/admin/owners' },
            { name: 'Shops', icon: BuildingStorefrontIcon, path: '/components/admin/shops/index' },
          ]
        : [
            { name: 'Employees', icon: UsersIcon, path: '/components/owner/employees' },
            { name: 'Products', icon: ShoppingBagIcon, path: '/components/owner/products' },
          ]

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-8">
                {role === 'admin' ? 'Admin Dashboard' : 'Owner Dashboard'}
            </h1>
            <ul className="space-y-4">
                {menuItems.map((item, idx) => (
                    <li
                        key={idx}
                        onClick={() => router.push(item.path)}
                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
