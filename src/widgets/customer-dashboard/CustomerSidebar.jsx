import { NavLink, Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  X,
  Waves,
  LogOut,
  Globe,
} from "lucide-react";

import { useTranslation } from "../../shared/i18n/index.js";

import { logoutUser } from "../../entities/user/api/authService.js";

function CustomerSidebar({ isOpen, onClose }) {
  const { lang } = useTranslation();
  const isArabic = lang === "ar";

  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    logoutUser();

    if (onClose) {
      onClose();
    }

    navigate("/login", { replace: true });
  };

  // Sidebar Navigation Items
  const menuItems = [
    {
      title: isArabic ? "الرئيسية" : "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      title: isArabic ? "حجوزاتي" : "My Bookings",
      path: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      title: isArabic ? "الملف الشخصي" : "My Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0C1226]/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        dir={isArabic ? "rtl" : "ltr"}
        className={`
          fixed inset-y-0 z-50 flex w-[280px] flex-col
          overflow-hidden border-gray-700/40 bg-[#0C1226] text-white
          shadow-[0_0_40px_rgba(12,18,38,0.15)]
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:border-e lg:translate-x-0
          ${isArabic ? "right-0" : "left-0"}
          ${
            isOpen
              ? "translate-x-0"
              : isArabic
                ? "translate-x-full"
                : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
            aria-label="Go to homepage"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDFB45] text-[#0C1226]">
              <Waves size={27} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-[27px] font-black tracking-[3px] text-white">
                DUCK
              </h2>

              <p className="mt-[-3px] text-[9px] font-bold tracking-[3px] text-white/45">
                WATER EXPERIENCES
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label={isArabic ? "إغلاق القائمة" : "Close sidebar"}
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-9">
          <div className="mb-6 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/40">
              {isArabic ? "القائمة الرئيسية" : "MAIN MENU"}
            </p>

            <span className="h-px w-10 bg-white/15" />
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group flex items-center gap-4 rounded-xl
                    border border-transparent px-4 py-3.5
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#FDFB45] text-[#0C1226] shadow-[0_5px_18px_rgba(253,251,69,0.12)]"
                        : "text-white/65 hover:border-white/5 hover:bg-white/[0.07] hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex h-10 w-10 items-center justify-center rounded-xl
                          transition-all duration-300
                          ${
                            isActive
                              ? "bg-white text-[#147D9F]"
                              : "bg-white/[0.07] text-white/60 group-hover:bg-[#147D9F]/20 group-hover:text-[#147D9F]"
                          }
                        `}
                      >
                        <Icon size={20} />
                      </span>

                      <span className="flex-1 text-sm font-bold">
                        {item.title}
                      </span>

                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-[#147D9F]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-6 py-5">
          {/* Customer Account */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#147D9F]/20 text-[#45C4E8]">
              <UserRound size={19} />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                {isArabic ? "حساب العميل" : "Customer Account"}
              </p>

              <p className="mt-1 text-[10px] text-white/45">
                {isArabic ? "مرحباً بك في DUCK" : "Welcome to DUCK"}
              </p>
            </div>
          </div>

          {/* Back to Website */}
          <Link
            to="/"
            onClick={onClose}
            className="mt-5 flex w-full items-center gap-3 rounded-xl border border-[#FDFB45]/15 bg-[#FDFB45]/5 px-4 py-3 text-sm font-bold text-[#FDFB45] transition hover:border-[#FDFB45]/30 hover:bg-[#FDFB45]/10"
          >
            <Globe size={18} />

            <span>
              {isArabic ? "العودة للموقع" : "Back to Website"}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-400/15 bg-red-500/5 px-4 py-3 text-sm font-bold text-red-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={18} />

            <span>
              {isArabic ? "تسجيل الخروج" : "Logout"}
            </span>
          </button>

          {/* Copyright */}
          <p className="mt-5 text-center text-[9px] font-medium tracking-[1.5px] text-white/25">
            DUCK © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default CustomerSidebar;