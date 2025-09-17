'use client'
import { HomeIcon, CubeIcon, UserGroupIcon, Cog6ToothIcon, ChartBarIcon, PowerIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleMenuClick = (name) => {
    if (name === 'Owners') {
      router.push('/components/admin/owners');
    } else if (name === 'Shops') {
      router.push('/components/admin/shops/index');
    }
    // Add other navigation logic here if needed
  }

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Admin</h1>
      <ul className="space-y-4">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            onClick={() => handleMenuClick(item.name)}
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
