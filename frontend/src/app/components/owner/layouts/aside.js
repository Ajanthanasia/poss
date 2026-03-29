'use client'

import Link from 'next/link';
import { UserGroupIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from "next/navigation";

export default function OwnerAsideBar() {
    const searchParams = useSearchParams();
    const shopId = searchParams.get("shop_id");
    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col p-4">

            <Link href="/components/owner/views/dashboard">
                <h1 className="text-2xl font-bold mb-4">Home</h1>
            </Link>

            <div className="space-y-4">
                {/* Employees */}
                {/* <Link href={`/components/owner/employees?shop_id=${shopId}`} className="w-full flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <UserGroupIcon className="h-5 w-5" />
                    <span>Employees</span>
                </Link> */}

                {/* Products - Goes to List */}
                <Link href={`/components/owner/products/list?shop_id=${shopId}`} className="w-full flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <CubeIcon className="h-5 w-5" />
                    <span>Products</span>
                </Link>

                <Link href={`/components/owner/make-sales?shop_id=${shopId}`} className="w-full flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <CubeIcon className="h-5 w-5" />
                    <span>Make Sale</span>
                </Link>
            </div>
        </div>
    );
}