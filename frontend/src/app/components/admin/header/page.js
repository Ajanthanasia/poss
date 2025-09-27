'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

export default function AdminHeader() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Logout handler
    const logout = async () => {
        localStorage.clear();
        console.log('Logout Success');
        router.push('/components/login'); // Directly push the route
    }

    // Navigate to Edit Profile
    const goToProfile = () => {
        router.push('/profile'); // ✅ Edit profile page
        setDropdownOpen(false);
    };

    // Navigate to View Profile
    const goToViewProfile = () => {
        router.push('/view-profile'); // ✅ View profile page
        setDropdownOpen(false);
    };

    return (
        <header className="bg-gray-900">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5 hover:text-indigo-400 focus:text-indigo-400 transition">
                        <span className="sr-only">Your Company</span>
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            alt=""
                            className="h-8 w-auto"
                        />
                    </a>
                </div>

                {/* Desktop nav links */}
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition">Features</a>
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition">Marketplace</a>
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition">Company</a>
                </div>

                {/* Right-side buttons */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6 relative">
                    {/* Profile Dropdown */}
                    <div
                        className="text-sm/6 font-semibold text-white cursor-pointer hover:text-indigo-400 transition flex items-center gap-1"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Profile <HiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-10 w-44 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                            {/* ✅ Corrected View Profile link */}
                            <div
                                className="block px-4 py-2 text-white hover:bg-indigo-600 cursor-pointer transition text-sm"
                                onClick={goToViewProfile}
                            >
                                View Profile
                            </div>
                            <div
                                className="block px-4 py-2 text-white hover:bg-indigo-600 cursor-pointer transition text-sm"
                                onClick={goToProfile}
                            >
                                Edit Profile
                            </div>
                        </div>
                    )}

                    {/* Logout */}
                    <div
                        className="text-sm/6 font-semibold text-white cursor-pointer hover:text-indigo-400 transition"
                        onClick={logout}
                    >
                        Log out &rarr;
                    </div>
                </div>
            </nav>

            {/* Mobile menu dialog */}
            <dialog id="mobile-menu" className="backdrop:bg-transparent lg:hidden">
                <div tabIndex="0" className="fixed inset-0 focus:outline-none">
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5 hover:text-indigo-400 transition">
                                <span className="sr-only">Your Company</span>
                                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" className="h-8 w-auto" />
                            </a>
                            <button type="button" command="close" commandfor="mobile-menu" className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-indigo-400 transition">
                                <span className="sr-only">Close menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
                                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-white/10">
                                <div className="space-y-2 py-6">
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition">Features</a>
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition">Marketplace</a>
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition">Company</a>
                                </div>
                                <div className="py-6 space-y-2">
                                    {/* ✅ Corrected View Profile link */}
                                    <div
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition cursor-pointer"
                                        onClick={goToViewProfile}
                                    >
                                        View Profile
                                    </div>
                                    <div
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition cursor-pointer"
                                        onClick={goToProfile}
                                    >
                                        Edit Profile
                                    </div>
                                    <div
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 transition cursor-pointer"
                                        onClick={logout}
                                    >
                                        Log out
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </header>
    );
}
