"use client"

import OwnerHeader from "./header";
import OwnerAsideBar from "./aside";

export default function OwnerLayout({ children }) {
    return (
        <>
            <div className="flex min-h-screen bg-gray-100 font-sans text-sm flex-col">
                {/* Header */}
                <OwnerHeader />

                {/* Main Content */}
                <div className="flex-1 flex">

                    {/* <div className="w-64 bg-gray-800 text-white">
                        <OwnerAsideBar />
                    </div> */}

                    {/* Page content */}
                    <main className="flex-1 p-6 bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}