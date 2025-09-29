"use client"

import OwnerLayout from "../../layouts/page";

export default function OwnerDashboard() {
    return (
        <>
            <OwnerLayout>
                <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

                    {/* Header */}
                    <h1 className="text-xl font-bold text-black self-start">
                        <div>Hi, Owner Welcome to our POS System</div>
                    </h1>
                </div>
            </OwnerLayout>
        </>
    );
}