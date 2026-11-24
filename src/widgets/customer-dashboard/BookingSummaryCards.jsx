import {
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function BookingSummaryCards({ stats = [], isArabic = true }) {
  const cards = [
    {
      key: "total",
      label: isArabic ? "إجمالي الحجوزات" : "Total Bookings",
      icon: CalendarDays,
      color: "#147D9F",
    },
    {
      key: "confirmed",
      label: isArabic ? "الحجوزات المؤكدة" : "Confirmed Bookings",
      icon: CheckCircle2,
      color: "#16A36A",
    },
    {
      key: "upcoming",
      label: isArabic ? "الرحلات القادمة" : "Upcoming Trips",
      icon: Clock3,
      color: "#C58B25",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const stat = stats.find((item) => item.key === card.key);

        return (
          <div
            key={card.key}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                }}
              >
                <Icon size={23} />
              </div>

              <span className="text-3xl font-bold text-[#0C1226]">
                {stat?.value ?? 0}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default BookingSummaryCards;