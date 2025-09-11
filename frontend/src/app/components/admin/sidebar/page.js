'use client'
import { HomeIcon, CubeIcon, UserGroupIcon, Cog6ToothIcon, ChartBarIcon, PowerIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon },
  { name: 'Products', icon: CubeIcon },
  { name: 'Orders', icon: ShoppingBagIcon },
  { name: 'Owners', icon: UserGroupIcon },
  { name: 'Shops', icon: BuildingStorefrontIcon },
  { name: 'Reports', icon: ChartBarIcon },
  { name: 'Settings', icon: Cog6ToothIcon },
  { name: 'Logout', icon: PowerIcon },
]

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8"> Admin</h1>
      <ul className="space-y-4">
        {menuItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </li>
 ))}
      </ul>
    </div>
  )
}