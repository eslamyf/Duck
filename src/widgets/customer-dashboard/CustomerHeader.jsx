import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Globe,
} from "lucide-react";

import { useTranslation } from "../../shared/i18n/index.js";
import { getCurrentUser } from "../../entities/user/api/authService.js";

function CustomerHeader({ onMenuClick }) {
  const { lang, setLanguage } = useTranslation();
  const location = useLocation();

  const isArabic = lang === "ar";

  // Get logged-in user
  const currentUser = getCurrentUser();

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    (isArabic ? "مستخدم" : "User");

  const userInitial =
    displayName.trim().charAt(0).toUpperCase() || "U";

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard" || path === "/dashboard/") {
      return isArabic ? "الرئيسية" : "Overview";
    }

    if (path.includes("/dashboard/bookings")) {
      return isArabic ? "حجوزاتي" : "My Bookings";
    }

    if (path.includes("/dashboard/profile")) {
      return isArabic ? "الملف الشخصي" : "My Profile";
    }

    return isArabic ? "لوحة التحكم" : "Dashboard";
  };

  const handleLanguageChange = () => {
    setLanguage(isArabic ? "en" : "ar");
  };

  return (
    <header
      dir={isArabic ? "rtl" : "ltr"}
      className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-2 border-b border-gray-100 bg-white/95 px-3 backdrop-blur-md sm:min-h-[88px] sm:gap-4 sm:px-8 lg:px-10"
    >
      {/* Left Section */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C1226] text-white transition hover:bg-[#147D9F] lg:hidden"
          aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        >
          <Menu size={21} />
        </button>

        {/* Page Title */}
        <div className="min-w-0 flex-1">
          <p className="mb-1 whitespace-nowrap text-[8px] font-bold uppercase tracking-[1.5px] text-[#147D9F] sm:text-[10px] sm:tracking-[2px]">
            <span className="sm:hidden">DUCK PORTAL</span>
            <span className="hidden sm:inline">
              DUCK CUSTOMER PORTAL
            </span>
          </p>

          <h1 className="whitespace-nowrap text-base font-black leading-tight text-[#0C1226] sm:text-xl">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">

        {/* Language Switcher */}
        <button
          type="button"
          onClick={handleLanguageChange}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-2 text-xs font-bold text-[#0C1226] transition hover:border-[#147D9F]/30 hover:bg-gray-50 sm:gap-2 sm:px-3"
          aria-label={isArabic ? "Switch to English" : "التغيير إلى العربية"}
        >
          <Globe size={17} className="shrink-0 text-[#147D9F]" />

          <span className="sm:hidden">
            {isArabic ? "EN" : "AR"}
          </span>

          <span className="hidden sm:inline">
            {isArabic ? "English" : "العربية"}
          </span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-[#0C1226] transition hover:bg-gray-50"
          aria-label={isArabic ? "الإشعارات" : "Notifications"}
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#147D9F]" />
        </button>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-gray-200 sm:block" />

        {/* Logged-in User */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={displayName}
              className="h-9 w-9 rounded-full border-2 border-[#FDFB45] object-cover sm:h-10 sm:w-10"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDFB45] text-sm font-black text-[#0C1226] sm:h-10 sm:w-10">
              {userInitial}
            </div>
          )}

          <div className="hidden text-start sm:block">
            <p className="max-w-[140px] truncate text-xs font-bold text-[#0C1226]">
              {displayName}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {isArabic ? "عميل" : "Customer"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;