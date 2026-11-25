import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    Globe,
} from "lucide-react";

import AdminSidebar from "../widgets/admin-sidebar/AdminSidebar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F4F6FA] text-[#0C1226]">
            <div className="flex min-h-screen">
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl border border-gray-200 p-2.5 text-[#0C1226] transition hover:bg-gray-100 lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <Menu size={21} />
                            </button>

                            <div>
                                <p className="text-xs font-medium text-gray-400">
                                    DUCK / ADMINISTRATION
                                </p>
                                <h1 className="mt-1 text-lg font-bold sm:text-xl">
                                    Admin Dashboard
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Search */}
                            <button
                                className="hidden rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-50 sm:block"
                                aria-label="Search"
                            >
                                <Search size={19} />
                            </button>

                            {/* Language */}
                            <button
                                className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 md:flex"
                            >
                                <Globe size={17} />
                                <span>EN</span>
                                <ChevronDown size={14} />
                            </button>

                            {/* Notifications */}
                            <button
                                className="relative rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-50"
                                aria-label="Notifications"
                            >
                                <Bell size={19} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            {/* Admin Profile */}
                            <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:gap-3 sm:pl-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C1226] text-sm font-bold text-[#FDFB45]">
                                    A
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold text-[#0C1226]">
                                        Administrator
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Super Admin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto w-full max-w-[1600px]">
                            <Outlet />
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-gray-200 bg-white px-6 py-4">
                        <p className="text-center text-xs text-gray-400">
                            © {new Date().getFullYear()} DUCK. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
