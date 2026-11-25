import { useState } from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Search,
} from "lucide-react";

import { useTranslation } from "../../shared/i18n/index.js";

import { getCurrentUser } from "../../entities/user/api/authService.js";

import { getUserBookings } from "../../entities/booking/api/bookingService.js";

function MyBookingsPage() {
  const { lang } = useTranslation();
  const isArabic = lang === "ar";

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load current user's bookings
  const [bookings] = useState(() => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) return [];
    return getUserBookings(currentUser.id);
  });

  // Booking filters
  const filters = [
    { key: "all", label: isArabic ? "الكل" : "All" },
    { key: "confirmed", label: isArabic ? "مؤكد" : "Confirmed" },
    { key: "pending", label: isArabic ? "قيد الانتظار" : "Pending" },
    { key: "paid", label: isArabic ? "مدفوع" : "Paid" },
    { key: "completed", label: isArabic ? "مكتمل" : "Completed" },
    { key: "cancelled", label: isArabic ? "ملغي" : "Cancelled" },
    { key: "refunded", label: isArabic ? "مسترد" : "Refunded" },
  ];

  // Status translations
  const statusLabels = {
    confirmed: isArabic ? "مؤكد" : "Confirmed",
    pending: isArabic ? "قيد الانتظار" : "Pending",
    completed: isArabic ? "مكتمل" : "Completed",
    cancelled: isArabic ? "ملغي" : "Cancelled",
    paid: isArabic ? "مدفوع" : "Paid",
    refunded: isArabic ? "مسترد" : "Refunded",
  };

  // Status colors
  const statusStyles = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-700",
    paid: "bg-emerald-50 text-emerald-700",
    refunded: "bg-gray-100 text-gray-600",
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const status = String(booking.status || "").toLowerCase();

    const matchesFilter =
      activeFilter === "all" || status === activeFilter;

    const title =
      booking.title || booking.experienceName || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Format booking price
  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return isArabic ? "غير محدد" : "Not specified";
    }

    if (typeof price === "number") {
      return `${price.toLocaleString(isArabic ? "ar-EG" : "en-US")} EGP`;
    }

    return price;
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-7"
    >
      {/* Page Heading */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[2px] text-[#147D9F]">
          DUCK CUSTOMER PORTAL
        </span>

        <h2 className="mt-2 text-2xl font-black text-[#0C1226]">
          {isArabic ? "حجوزاتي" : "My Bookings"}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {isArabic
            ? "تابع جميع رحلاتك وتجاربك المائية."
            : "Manage and track all your water experiences."}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

        {/* Search */}
        <div className="relative mb-5">
          <Search
            size={19}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
              isArabic ? "right-4" : "left-4"
            }`}
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={
              isArabic ? "ابحث عن تجربة..." : "Search bookings..."
            }
            className={`h-12 w-full rounded-lg border border-gray-200 bg-[#F8FAFC] text-sm outline-none transition focus:border-[#147D9F] ${
              isArabic ? "pr-11 pl-4" : "pl-11 pr-4"
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                activeFilter === filter.key
                  ? "bg-[#0C1226] text-[#FDFB45]"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">

        {/* List Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0C1226]">
            {isArabic ? "جميع الحجوزات" : "All Bookings"}
          </h3>

          <span className="text-xs text-gray-400">
            {filteredBookings.length}{" "}
            {isArabic ? "حجز" : "Bookings"}
          </span>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#147D9F]/10">
              <Ticket
                size={30}
                className="text-[#147D9F]"
              />
            </div>

            <h3 className="font-bold text-[#0C1226]">
              {bookings.length === 0
                ? isArabic
                  ? "لا توجد حجوزات حتى الآن"
                  : "No Bookings Yet"
                : isArabic
                  ? "لا توجد نتائج مطابقة"
                  : "No Matching Bookings"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {bookings.length === 0
                ? isArabic
                  ? "ستظهر حجوزاتك هنا بمجرد إتمام أول حجز."
                  : "Your bookings will appear here once you make your first booking."
                : isArabic
                  ? "جرب تغيير البحث أو اختيار حالة أخرى."
                  : "Try changing your search or selecting another filter."}
            </p>

          </div>
        ) : (
          /* Bookings Cards */
          filteredBookings.map((booking) => {
            const status = String(
              booking.status || ""
            ).toLowerCase();

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  {/* Booking Information */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">

                      <h3 className="text-lg font-bold text-[#0C1226]">
                        {booking.title ||
                          booking.experienceName ||
                          (isArabic ? "تجربة مائية" : "Water Experience")}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          statusStyles[status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabels[status] ||
                          (isArabic ? "غير محدد" : "Unknown")}
                      </span>

                    </div>

                    {/* Booking Details */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">

                      {booking.date && (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          {booking.date}
                        </span>
                      )}

                      {booking.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {booking.time}
                        </span>
                      )}

                      {booking.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />
                          {booking.location}
                        </span>
                      )}

                    </div>
                  </div>

                  {/* Booking Price */}
                  <div className="sm:text-end">
                    <p className="text-xs text-gray-400">
                      {isArabic ? "قيمة الحجز" : "Booking Price"}
                    </p>

                    <p className="mt-1 text-lg font-black text-[#147D9F]">
                      {formatPrice(booking.price)}
                    </p>
                  </div>

                </div>

                {/* Booking Reference */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-[11px] text-gray-400">
                    {isArabic ? "رقم الحجز" : "Booking Reference"}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#0C1226]">
                    {booking.reference || booking.id}
                  </p>
                </div>

              </div>
            );
          })
        )}

      </div>
    </section>
  );
}

export default MyBookingsPage;