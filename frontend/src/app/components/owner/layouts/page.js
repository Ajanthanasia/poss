"use client";

import { useState } from "react";
import OwnerHeader from "./header";
import OwnerAsideBar from "./aside";

export default function OwnerLayout({ children, showSidebar = true }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen overflow-hidden bg-gray-100 font-sans text-sm flex flex-col">
            {/* Header */}
            <OwnerHeader />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Sidebar — always rendered, handles open/collapsed state internally */}
                {showSidebar && (
                    <OwnerAsideBar
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                    />
                )}

                {/* Page content */}
                <main className="flex-1 overflow-hidden p-4 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
