'use client'

export default function AdminHeader() {
    const logout = async () => {
        localStorage.clear();
        console.log('Logout Success');
        location.reload();
    }

    return (
        <>
            <header className="bg-gray-900">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                alt=""
                                className="h-8 w-auto"
                            />
                        </a>
                    </div>

                    <div className="flex lg:hidden">
                        <button type="button" command="show-modal" commandfor="mobile-menu" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400">
                            <span className="sr-only">Open main menu</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
                                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <el-popover-group className="hidden lg:flex lg:gap-x-12">
                        <div className="relative">
                            <button popoverTarget="desktop-menu-product" className="flex items-center gap-x-1 text-sm/6 font-semibold text-white">
                                Product
                                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 flex-none text-gray-500" aria-hidden="true">
                                    <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
                                </svg>
                            </button>

                            <el-popover
                                id="desktop-menu-product"
                                anchor="bottom"
                                popover
                                className="w-screen max-w-md overflow-hidden rounded-3xl bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete [--anchor-gap:--spacing(3)] backdrop:bg-transparent open:block data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                                <div className="p-4">
                                    {/* Example Menu Item */}
                                    <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-white/5">
                                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-gray-700">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 text-gray-400 group-hover:text-white" aria-hidden="true">
                                                <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="flex-auto">
                                            <a href="#" className="block font-semibold text-white">
                                                Analytics
                                                <span className="absolute inset-0"></span>
                                            </a>
                                            <p className="mt-1 text-gray-400">Get a better understanding of your traffic</p>
                                        </div>
                                    </div>
                                    {/* Add more menu items here */}
                                </div>
                            </el-popover>
                        </div>

                        <a href="#" className="text-sm/6 font-semibold text-white">Features</a>
                        <a href="#" className="text-sm/6 font-semibold text-white">Marketplace</a>
                        <a href="#" className="text-sm/6 font-semibold text-white">Company</a>
                    </el-popover-group>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <div className="text-sm/6 font-semibold text-white cursor-pointer" onClick={logout}>
                            Log out <span aria-hidden="true">&rarr;</span>
                        </div>
                    </div>
                </nav>

                <el-dialog>
                    <dialog id="mobile-menu" className="backdrop:bg-transparent lg:hidden">
                        <div tabIndex="0" className="fixed inset-0 focus:outline-none">
                            <el-dialog-panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                                <div className="flex items-center justify-between">
                                    <a href="#" className="-m-1.5 p-1.5">
                                        <span className="sr-only">Your Company</span>
                                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" className="h-8 w-auto" />
                                    </a>
                                    <button type="button" command="close" commandfor="mobile-menu" className="-m-2.5 rounded-md p-2.5 text-gray-400">
                                        <span className="sr-only">Close menu</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
                                            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-6 flow-root">
                                    <div className="-my-6 divide-y divide-white/10">
                                        <div className="space-y-2 py-6">
                                            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5">Features</a>
                                            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5">Marketplace</a>
                                            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5">Company</a>
                                        </div>
                                        <div className="py-6">
                                            <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5">Log in</a>
                                        </div>
                                    </div>
                                </div>
                            </el-dialog-panel>
                        </div>
                    </dialog>
                </el-dialog>
            </header>
        </>
    )
}
