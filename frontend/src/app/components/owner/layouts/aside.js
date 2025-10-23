'use client'
import { UserGroupIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function OwnerAsideBar() {
    return (
        <div className="h-screen bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-8">Owner Dashboard</h1>
            <div className="space-y-4">
                <button className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <UserGroupIcon className="h-5 w-5" />
                    <span>Employees</span>
                </button>
                <button className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <CubeIcon className="h-5 w-5" />
                    <span>Products</span>
                </button>
            </div>
        </div>
    );
}
