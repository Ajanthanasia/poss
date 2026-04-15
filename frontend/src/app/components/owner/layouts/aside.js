'use client'

import Link from 'next/link';
import { useSearchParams, usePathname } from "next/navigation";
import { CubeIcon, ShoppingCartIcon, HomeIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function OwnerAsideBar({ isOpen, onToggle }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const shopId = searchParams.get("shop_id");

    const navItems = [
        {
            label: "Products",
            href: `/components/owner/products/list?shop_id=${shopId}`,
            match: "/components/owner/products",
            icon: CubeIcon,
        },
        {
            label: "Make Sale",
            href: `/components/owner/make-sales?shop_id=${shopId}`,
            match: "/components/owner/make-sales",
            icon: ShoppingCartIcon,
        },
    ];

    return (
        <div className={`h-full bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-200 ${isOpen ? 'w-64' : 'w-12'}`}>

            {/* Hamburger toggle — always visible */}
            <button
                onClick={onToggle}
                className="flex items-center justify-center p-3 hover:bg-gray-700 transition-colors"
                title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
                <Bars3Icon className="h-5 w-5" />
            </button>

            {/* Content — only shown when open */}
            {isOpen && (
                <>
                    {/* Home */}
                    <Link href="/components/owner/views/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors mb-2">
                        <HomeIcon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-bold text-lg">Home</span>
                    </Link>

                    {/* Nav items */}
                    <nav className="space-y-1 px-2">
                        {navItems.map(({ label, href, match, icon: Icon }) => {
                            const isActive = pathname.startsWith(match);
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-700 text-gray-300"
                                    }`}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </>
            )}
        </div>
    );
}
