import { useState } from "react";
import {
  Compass,
  Waves,
} from "lucide-react";

import { useTranslation } from "../../shared/i18n/index.js";

import {
  getCurrentUser,
} from "../../entities/user/api/authService.js";

import {
  getUserBookings,
  getBookingStats,
} from "../../entities/booking/api/bookingService.js";

import BookingSummaryCards from "./BookingSummaryCards.jsx";
import UpcomingBookings from "./UpcomingBookings.jsx";

function DashboardOverview() {
  const { lang } = useTranslation();
  const isArabic = lang === "ar";

  const [{ stats, bookings }] = useState(() => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      return {
        stats: { total: 0, confirmed: 0, upcoming: 0 },
        bookings: [],
      };
    }

    const userBookings = getUserBookings(currentUser.id);
    const bookingStats = getBookingStats(currentUser.id);

    return {
      bookings: userBookings,
      stats: {
        total: bookingStats.total,
        confirmed: bookingStats.confirmed,
        upcoming: bookingStats.upcoming,
      },
    };
  });

  // Convert statistics object into the format expected by BookingSummaryCards
  const statsList = [
    { key: "total", value: stats.total },
    { key: "confirmed", value: stats.confirmed },
    { key: "upcoming", value: stats.upcoming },
  ];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-7"
    >
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0C1226] p-7 text-white md:p-9">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#147D9F]/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#FDFB45]/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#FDFB45]">
            <Waves size={14} />

            {isArabic
              ? "مرحبًا بك في DUCK"
              : "WELCOME TO DUCK"}
          </span>

          <h2 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">
            {isArabic
              ? "استعد لمغامرتك القادمة!"
              : "Get Ready for Your Next Adventure!"}
          </h2>

          <p className="mb-6 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            {isArabic
              ? "تابع حجوزاتك واكتشف تجارب مائية جديدة واستمتع بكل لحظة."
              : "Track your bookings, discover new water experiences, and enjoy every moment."}
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FDFB45] px-5 py-3 text-sm font-bold text-[#0C1226] transition hover:-translate-y-0.5 hover:bg-[#f3f044]"
          >
            <Compass size={18} />

            {isArabic
              ? "اكتشف التجارب"
              : "Explore Experiences"}
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#0C1226]">
            {isArabic ? "نظرة عامة" : "Overview"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isArabic
              ? "ملخص سريع لنشاط حسابك"
              : "A quick summary of your account activity"}
          </p>
        </div>

        <BookingSummaryCards
          stats={statsList}
          isArabic={isArabic}
        />
      </div>

      {/* Upcoming Bookings Section */}
      <UpcomingBookings
        bookings={bookings}
        isArabic={isArabic}
      />
    </section>
  );
}

export default DashboardOverview;