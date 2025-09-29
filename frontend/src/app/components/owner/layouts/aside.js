'use client'
import { HomeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";

export default function OwnerAsideBar() {
    return (
        <>
            <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-8">Owner</h1>
                <div className="space-y-4">
                    <button className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                        <HomeIcon className="h-5 w-5" />
                        <span>My Shops</span>
                    </button>
                </div>

            </div>
        </>
    );
}