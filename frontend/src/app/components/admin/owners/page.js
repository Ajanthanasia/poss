'use client'

import AdminLayout from "../common/page";
import { useRouter } from "next/navigation";

export default function OwnersList() {
  const router = useRouter();

  const handleAddOwner = () => {
    router.push("/components/admin/owner-add-form");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-black self-start">Owners List</h1>

        {/* Owners List Section */}
        <div className="w-full max-w-5xl bg-white rounded shadow p-6 flex flex-col gap-6">

          {/* Add New Owner Button */}
          <button
            onClick={handleAddOwner}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-md transition-colors duration-200 self-start"
          >
            Add New Owner
          </button>

          {/* Placeholder for Owners List (Empty for now) */}
          <div className="text-gray-700 text-lg">
            {/* Owners table/list can go here */}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
