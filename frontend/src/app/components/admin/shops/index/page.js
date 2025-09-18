'use client';

import { useRouter } from "next/navigation";
import AdminLayout from "../../common/page";

export default function ShopsListComponent() {
    const router = useRouter();

    const handleAddNewShop = () => {
        router.push("/components/admin/shop-add-form"); // path to your shop-add-form page
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

                {/* Header */}
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-black">Shop List</h1>
                    <button
                        onClick={handleAddNewShop}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                        Add New Shop
                    </button>
                </div>

                {/* Shops List Section */}
                <div className="w-full max-w-5xl bg-white rounded shadow p-6 flex flex-col gap-6">
                    {/* Here you can map through your shops and display them */}
                </div>

            </div>
        </AdminLayout>
    );
}
