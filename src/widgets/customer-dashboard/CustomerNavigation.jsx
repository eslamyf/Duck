import { NavLink, Link } from "react-router-dom";
import {
  Waves,
  Compass,
  CalendarDays,
  UserRound,
  Globe2,
  ArrowUpRight,
  ArrowUpLeft,
} from "lucide-react";
import { useTranslation } from "../../shared/i18n/index.js";

function CustomerNavigation() {
  const { lang, setLanguage } = useTranslation();
  const isArabic = lang === "ar";

  const navItems = [
    {
      label: isArabic ? "الرئيسية" : "Overview",
      path: "/dashboard",
      icon: Compass,
      end: true,
    },
    {
      label: isArabic ? "حجوزاتي" : "My Bookings",
      path: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      label: isArabic ? "اكتشف" : "Discover",
      path: "/",
      icon: Waves,
    },
    {
      label: isArabic ? "حسابي" : "My Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  return (
    <header
      dir={isArabic ? "rtl" : "ltr"}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0C1226]/95 text-white shadow-lg shadow-black/10 backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-5 px-4 sm:px-8 lg:px-12">

        {/* Brand */}
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFB45] text-[#0C1226]">
            <Waves size={23} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-[3px]">
              DUCK
            </h1>

            <p className="text-[8px] font-semibold tracking-[3px] text-white/40">
              WATER EXPERIENCES
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-2 rounded-full px-4 py-3
                  text-sm font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#FDFB45] text-[#0C1226]"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(isArabic ? "en" : "ar")}
            className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2.5 text-xs font-bold text-white/80 transition hover:border-[#FDFB45] hover:text-[#FDFB45]"
            aria-label="Change language"
          >
            <Globe2 size={16} />
            {isArabic ? "EN" : "عربي"}
          </button>

          {/* Account */}
          <Link
            to="/dashboard/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#FDFB45] hover:text-[#FDFB45]"
            aria-label={isArabic ? "حسابي" : "My Profile"}
          >
            <UserRound size={19} />
          </Link>

          {/* Explore Button */}
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-full bg-[#FDFB45] px-5 py-3 text-xs font-black text-[#0C1226] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDFB45]/20 xl:flex"
          >
            {isArabic ? "اكتشف DUCK" : "EXPLORE DUCK"}

            {isArabic ? (
              <ArrowUpLeft size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        dir={isArabic ? "rtl" : "ltr"}
        className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5
                text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-[#FDFB45] text-[#0C1226]"
                    : "bg-white/5 text-white/65 hover:bg-white/10"
                }
              `}
            >
              <Icon size={15} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}

export default CustomerNavigation;