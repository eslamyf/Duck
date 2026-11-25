import { Link } from "react-router-dom";
import {
    CalendarDays,
    Users,
    Waves,
    Wallet,
    ArrowUpRight,
    ArrowRight,
    Clock,
    CheckCircle2,
    Plus,
    ClipboardList,
    Activity,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        title: "Total Bookings",
        value: "0",
        description: "All registered bookings",
        icon: CalendarDays,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Total Revenue",
        value: "EGP 0",
        description: "Total booking revenue",
        icon: Wallet,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Total Customers",
        value: "0",
        description: "Registered customers",
        icon: Users,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Active Activities",
        value: "0",
        description: "Currently available activities",
        icon: Waves,
        color: "bg-orange-50 text-orange-600",
    },
];

const quickActions = [
    {
        title: "Manage Bookings",
        description: "Review and manage customer bookings",
        icon: CalendarDays,
        path: "/admin/bookings",
    },
    {
        title: "Manage Activities",
        description: "Update water activities and experiences",
        icon: Waves,
        path: "/admin/activities",
    },
    {
        title: "Manage Customers",
        description: "View and manage customer accounts",
        icon: Users,
        path: "/admin/customers",
    },
];

function AdminDashboardPage() {
    return (
        <div className="space-y-8">

            {/* Welcome Section */}
            <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#0C1226] p-6 text-white sm:p-8 lg:flex-row lg:items-center">
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#FDFB45]" />
                        <span className="text-xs font-semibold uppercase tracking-[2px] text-[#FDFB45]">
                            DUCK MANAGEMENT
                        </span>
                    </div>

                    <h2 className="text-2xl font-black sm:text-3xl">
                        Welcome to Admin Dashboard
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                        Manage your bookings, customers, activities and business
                        operations from one central workspace.
                    </p>
                </div>

                <Link
                    to="/admin/bookings"
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 text-sm font-bold text-[#0C1226] transition hover:bg-[#e9e743]"
                >
                    View Bookings
                    <ArrowUpRight size={18} />
                </Link>
            </section>

            {/* Statistics */}
            <section>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#0C1226]">
                            Business Overview
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            Your business performance at a glance
                        </p>
                    </div>

                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm">
                        All Time
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                                    >
                                        <Icon size={23} />
                                    </div>

                                    <TrendingUp size={18} className="text-gray-300" />
                                </div>

                                <p className="mt-5 text-sm font-medium text-gray-400">
                                    {stat.title}
                                </p>

                                <h4 className="mt-2 text-2xl font-black text-[#0C1226]">
                                    {stat.value}
                                </h4>

                                <p className="mt-2 text-xs text-gray-400">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Recent Bookings */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-[#0C1226]">
                                Recent Bookings
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Latest customer reservations
                            </p>
                        </div>

                        <Link
                            to="/admin/bookings"
                            className="flex items-center gap-1 text-xs font-bold text-[#147D9F] hover:underline"
                        >
                            View All
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-5 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                            <ClipboardList size={27} />
                        </div>

                        <h4 className="mt-4 font-bold text-[#0C1226]">
                            No Bookings Yet
                        </h4>

                        <p className="mt-2 max-w-xs text-xs leading-6 text-gray-400">
                            Customer bookings will appear here once booking data
                            is connected to the dashboard.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div>
                        <h3 className="font-bold text-[#0C1226]">
                            Quick Actions
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                            Frequently used management tools
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.title}
                                    to={action.path}
                                    className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-[#147D9F]/30 hover:bg-[#147D9F]/5"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4F6FA] text-[#147D9F] transition group-hover:bg-[#147D9F] group-hover:text-white">
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-[#0C1226]">
                                            {action.title}
                                        </h4>

                                        <p className="mt-1 text-[11px] leading-5 text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight
                                        size={16}
                                        className="shrink-0 text-gray-300 transition group-hover:text-[#147D9F]"
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-5 rounded-xl bg-[#FDFB45]/20 p-4">
                        <div className="flex items-center gap-2">
                            <Activity size={18} className="text-[#0C1226]" />
                            <span className="text-xs font-bold text-[#0C1226]">
                                Management Tip
                            </span>
                        </div>

                        <p className="mt-2 text-xs leading-6 text-gray-600">
                            Keep your activities and availability updated to
                            provide customers with an accurate booking experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* System Status */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={22} />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-[#0C1226]">
                                Admin Workspace
                            </h3>

                            <p className="mt-1 text-xs text-gray-400">
                                Dashboard interface is ready for data integration.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Interface Ready
                    </div>
                </div>
            </section>

        </div>
    );
}

export default AdminDashboardPage;