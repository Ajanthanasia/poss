'use client'

import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const router = useRouter();

    // Logout handler
    const logout = async () => {
        localStorage.clear();
        console.log('Logout Success');
        location.reload();
    }

    // Navigate to Profile page
    const goToProfile = () => {
        router.push('/profile'); // Directly push the route
    }

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

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button 
                        type="button" 
                        command="show-modal" 
                        commandfor="mobile-menu" 
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-indigo-400 focus:text-indigo-400 transition"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
                            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Desktop nav links */}
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 focus:text-indigo-400 transition">Features</a>
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 focus:text-indigo-400 transition">Marketplace</a>
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 focus:text-indigo-400 transition">Company</a>
                </div>

                {/* Right-side buttons */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6">
                    <div
                        className="text-sm/6 font-semibold text-white cursor-pointer hover:text-indigo-400 focus:text-indigo-400 transition"
                        onClick={goToProfile}
                    >
                        Profile
                    </div>
                    <div
                        className="text-sm/6 font-semibold text-white cursor-pointer hover:text-indigo-400 focus:text-indigo-400 transition"
                        onClick={logout}
                    >
                        Log out <span aria-hidden="true">&rarr;</span>
                    </div>
                </div>
            </nav>

            {/* Mobile menu dialog */}
            <dialog id="mobile-menu" className="backdrop:bg-transparent lg:hidden">
                <div tabIndex="0" className="fixed inset-0 focus:outline-none">
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5 hover:text-indigo-400 focus:text-indigo-400 transition">
                                <span className="sr-only">Your Company</span>
                                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" className="h-8 w-auto" />
                            </a>
                            <button type="button" command="close" commandfor="mobile-menu" className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-indigo-400 focus:text-indigo-400 transition">
                                <span className="sr-only">Close menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
                                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-white/10">
                                <div className="space-y-2 py-6">
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 focus:text-indigo-400 transition">Features</a>
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 focus:text-indigo-400 transition">Marketplace</a>
                                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 focus:text-indigo-400 transition">Company</a>
                                </div>
                                <div className="py-6 space-y-2">
                                    <div
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 focus:text-indigo-400 transition cursor-pointer"
                                        onClick={goToProfile}
                                    >
                                        Profile
                                    </div>
                                    <div
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-indigo-400 focus:text-indigo-400 transition cursor-pointer"
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
    )
}
