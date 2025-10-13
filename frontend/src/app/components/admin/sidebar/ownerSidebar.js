'use client'
import { UsersIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function OwnerSidebar() {
  const router = useRouter();

  const handleMenuClick = (name) => {
    if (name === 'Employees') {
      router.push('/components/owner/employees');
    } else if (name === 'Products') {
      router.push('/components/owner/products');
    }
    // Add more navigation if needed
  }

  const menuItems = [
    { name: 'Employees', icon: UsersIcon },
    { name: 'Products', icon: ShoppingBagIcon }
  ]

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Owner Dashboard</h1>
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
