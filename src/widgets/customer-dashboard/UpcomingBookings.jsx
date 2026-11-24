import {
  CalendarDays,
  MapPin,
  Clock3,
} from "lucide-react";

function UpcomingBookings({ bookings = [], isArabic = true }) {
  // Normalize booking status
  const normalizeStatus = (status) => {
    return String(status || "").toLowerCase();
  };

  // Parse booking date safely
  const parseBookingDate = (date) => {
    if (!date) return null;

    const dateString = String(date);

    // Handle YYYY-MM-DD as local date
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    const parsedDate = dateMatch
      ? new Date(
          Number(dateMatch[1]),
          Number(dateMatch[2]) - 1,
          Number(dateMatch[3])
        )
      : new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  };

  // Get only upcoming bookings
  const upcomingBookings = bookings
    .filter((booking) => {
      const status = normalizeStatus(booking.status);
      const bookingDate = parseBookingDate(booking.date);

      const excludedStatuses = [
        "cancelled",
        "canceled",
        "refunded",
        "completed",
      ];

      return (
        bookingDate &&
        bookingDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
        !excludedStatuses.includes(status)
      );
    })
    .sort((a, b) => {
      return (
        parseBookingDate(a.date) - parseBookingDate(b.date)
      );
    });

  // Translate booking status
  const getStatus = (status) => {
    const statuses = {
      confirmed: isArabic ? "مؤكد" : "Confirmed",
      pending: isArabic ? "قيد الانتظار" : "Pending",
      paid: isArabic ? "مدفوع" : "Paid",
    };

    const normalizedStatus = normalizeStatus(status);

    return (
      statuses[normalizedStatus] ||
      (isArabic ? "غير محدد" : "Unknown")
    );
  };

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
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0C1226]">
            {isArabic ? "حجوزاتك القادمة" : "Upcoming Bookings"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isArabic
              ? "تابع تفاصيل مغامراتك القادمة"
              : "Keep track of your next adventures"}
          </p>
        </div>

        <CalendarDays
          size={23}
          className="text-[#147D9F]"
        />
      </div>

      {/* Empty State */}
      {upcomingBookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-[#F8FAFC] px-5 py-10 text-center">
          <CalendarDays
            size={36}
            className="mx-auto mb-3 text-gray-400"
          />

          <p className="font-semibold text-[#0C1226]">
            {isArabic
              ? "لا توجد حجوزات قادمة"
              : "No Upcoming Bookings"}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {isArabic
              ? "ستظهر هنا تفاصيل رحلاتك القادمة."
              : "Your upcoming trips will appear here."}
          </p>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-[#147D9F]/30 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Booking Information */}
              <div>
                <h3 className="font-bold text-[#0C1226]">
                  {booking.title ||
                    booking.experienceName ||
                    (isArabic ? "تجربة مائية" : "Water Experience")}
                </h3>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  {/* Date */}
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} />

                    {booking.date}
                  </span>

                  {/* Time */}
                  {booking.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />

                      {booking.time}
                    </span>
                  )}

                  {/* Location */}
                  {booking.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />

                      {booking.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Status & Price */}
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="rounded-full bg-[#147D9F]/10 px-3 py-1.5 text-xs font-bold text-[#147D9F]">
                  {getStatus(booking.status)}
                </span>

                <span className="text-sm font-bold text-[#0C1226]">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingBookings;