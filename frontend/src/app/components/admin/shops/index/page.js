'use client';

import AdminLayout from "../../common/page";

export default function ShopsListComponent() {
    return (
        <>
            <AdminLayout>
                <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

                    {/* Header */}
                    <h1 className="text-3xl font-bold text-black self-start">Shop List</h1>

                    {/* shops List Section */}
                    <div className="w-full max-w-5xl bg-white rounded shadow p-6 flex flex-col gap-6">

                    </div>
                </div>
            </AdminLayout>
        </>
    );
}