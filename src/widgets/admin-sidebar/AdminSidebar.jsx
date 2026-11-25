import { ROUTES } from '../../shared/config/routes.js';
import { NavLink, useNavigate } from 'react-router-dom';

import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Waves,
    Handshake,
    Tags,
    Clock,
    Images,
    ShieldCheck,
    ChartNoAxesCombined,
    LogOut,
    X,
    Anchor,
} from 'lucide-react';

const navigationItems = [
    {
        label: 'Dashboard',
        path: ROUTES.ADMIN,
        icon: LayoutDashboard,
    },
    {
        label: 'Bookings',
        path: ROUTES.ADMIN_BOOKINGS,
        icon: CalendarDays,
    },
    {
        label: 'Customers',
        path: ROUTES.ADMIN_CUSTOMERS,
        icon: Users,
    },
    {
        label: 'Activities',
        path: ROUTES.ADMIN_ACTIVITIES,
        icon: Waves,
    },
    {
        label: 'Providers',
        path: ROUTES.ADMIN_PROVIDERS,
        icon: Handshake,
    },
    {
        label: 'Pricing',
        path: ROUTES.ADMIN_PRICING,
        icon: Tags,
    },
    {
        label: 'Availability',
        path: ROUTES.ADMIN_AVAILABILITY,
        icon: Clock,
    },
    {
        label: 'Content',
        path: ROUTES.ADMIN_CONTENT,
        icon: Images,
    },
    {
        label: 'Users',
        path: ROUTES.ADMIN_USERS,
        icon: ShieldCheck,
    },
    {
        label: 'Reports',
        path: ROUTES.ADMIN_REPORTS,
        icon: ChartNoAxesCombined,
    },
];

function AdminSidebar({ isOpen = true, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm(
            'Are you sure you want to log out?'
        );

        if (!confirmed) return;

        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${
                    isOpen
                        ? 'visible opacity-100'
                        : 'invisible opacity-0'
                }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#0C1226] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
                    isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFB45] text-[#0C1226]">
                            <Anchor size={23} strokeWidth={2.5} />
                        </div>

                        <div className="text-left">
                            <h1 className="text-xl font-black tracking-wider">
                                DUCK
                            </h1>

                            <p className="text-[10px] font-medium uppercase tracking-[3px] text-white/40">
                                Admin Portal
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-7">

                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === ROUTES.ADMIN}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-[#FDFB45] text-[#0C1226] shadow-lg shadow-[#FDFB45]/10'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={19} strokeWidth={2} />

                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}

                </nav>

                {/* Bottom Section */}
                <div className="border-t border-white/10 p-4">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>

                    <div className="mt-4 rounded-xl bg-white/5 p-3">
                        <p className="text-xs font-semibold text-white/70">
                            DUCK Management
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                            Admin Control Panel
                        </p>
                    </div>

                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;