'use client'

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

export default function OwnerHeader() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            console.log(event);
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Logout handler
    const logout = async () => {
        localStorage.clear();
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
        <header className="bg-white text-black">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-6" aria-label="Global">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5 hover:text-blue-400 focus:text-indigo-400 transition">
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            alt=""
                            className="h-8 w-auto"
                        />
                    </a>
                </div>

                {/* Right-side buttons */}
                <div className="lg:flex lg:flex-1 lg:justify-end items-center gap-6 relative">

                    {/* Profile Dropdown */}
                    <div
                        className="text-sm/6 font-semibold text-black cursor-pointer hover:text-indigo-400 transition flex items-center gap-1"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Settings <HiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {dropdownOpen && (
                        <div>
                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={goToViewProfile}>
                                        View Profile
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={goToProfile}>
                                        Edit Profile
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
