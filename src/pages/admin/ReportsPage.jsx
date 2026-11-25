import { useMemo, useState } from "react";
import {
  Download,
  TrendingUp,
  CalendarCheck,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";

const DEMO_BOOKINGS = [
  {
    id: "BK-1001",
    activity: "Kayak",
    customer: "Ahmed Hassan",
    date: "2026-11-03",
    amount: 600,
    status: "Confirmed",
  },
  {
    id: "BK-1002",
    activity: "Water Bike",
    customer: "Sara Ali",
    date: "2026-11-05",
    amount: 450,
    status: "Completed",
  },
  {
    id: "BK-1003",
    activity: "SUP",
    customer: "Omar Mahmoud",
    date: "2026-11-08",
    amount: 250,
    status: "Completed",
  },
  {
    id: "BK-1004",
    activity: "Kayak",
    customer: "Mariam Adel",
    date: "2026-11-12",
    amount: 900,
    status: "Confirmed",
  },
  {
    id: "BK-1005",
    activity: "Water Bike",
    customer: "Youssef Samir",
    date: "2026-11-15",
    amount: 450,
    status: "Cancelled",
  },
  {
    id: "BK-1006",
    activity: "Kayak",
    customer: "Nour Mohamed",
    date: "2026-11-18",
    amount: 600,
    status: "Completed",
  },
  {
    id: "BK-1007",
    activity: "SUP",
    customer: "Ali Mostafa",
    date: "2026-11-20",
    amount: 500,
    status: "Confirmed",
  },
];

const PERIODS = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "Last 7 Days", value: "week" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("all");

  const bookings = useMemo(() => {
    const now = new Date();

    return DEMO_BOOKINGS.filter((booking) => {
      const bookingDate = new Date(booking.date);

      if (period === "month") {
        return (
          bookingDate.getMonth() === now.getMonth() &&
          bookingDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        return bookingDate >= sevenDaysAgo && bookingDate <= now;
      }

      return true;
    });
  }, [period]);

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );

  const revenue = completedBookings.reduce(
    (total, booking) => total + booking.amount,
    0
  );

  const activityStats = useMemo(() => {
    const stats = {};

    bookings.forEach((booking) => {
      if (!stats[booking.activity]) {
        stats[booking.activity] = {
          name: booking.activity,
          bookings: 0,
          revenue: 0,
        };
      }

      stats[booking.activity].bookings += 1;

      if (booking.status === "Completed") {
        stats[booking.activity].revenue += booking.amount;
      }
    });

    return Object.values(stats).sort(
      (a, b) => b.bookings - a.bookings
    );
  }, [bookings]);

  function exportCSV() {
    const headers = [
      "Booking ID",
      "Activity",
      "Customer",
      "Date",
      "Amount (EGP)",
      "Status",
    ];

    const rows = bookings.map((booking) => [
      booking.id,
      booking.activity,
      booking.customer,
      booking.date,
      booking.amount,
      booking.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "duck-booking-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1226]">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor bookings, revenue, and activity performance.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 font-semibold text-[#0C1226] hover:brightness-95"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button
            key={item.value}
            onClick={() => setPeriod(item.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              period === item.value
                ? "bg-[#0C1226] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<CalendarCheck size={20} />}
        />

        <StatCard
          title="Completed Bookings"
          value={completedBookings.length}
          icon={<TrendingUp size={20} />}
        />

        <StatCard
          title="Total Revenue"
          value={`${revenue.toLocaleString()} EGP`}
          icon={<DollarSign size={20} />}
        />

        <StatCard
          title="Customers"
          value={new Set(bookings.map((booking) => booking.customer)).size}
          icon={<Users size={20} />}
        />
      </div>

      {/* Booking Status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatusCard
          title="Confirmed"
          count={confirmedBookings.length}
          color="bg-blue-500"
          percentage={bookings.length ? (confirmedBookings.length / bookings.length) * 100 : 0}
        />

        <StatusCard
          title="Completed"
          count={completedBookings.length}
          color="bg-green-500"
          percentage={bookings.length ? (completedBookings.length / bookings.length) * 100 : 0}
        />

        <StatusCard
          title="Cancelled"
          count={cancelledBookings.length}
          color="bg-red-500"
          percentage={bookings.length ? (cancelledBookings.length / bookings.length) * 100 : 0}
        />
      </div>

      {/* Activity Performance */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#147D9F]/10 p-3 text-[#147D9F]">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#0C1226]">
                Activity Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Booking count and completed revenue by activity.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {activityStats.map((activity) => {
            const maxBookings = Math.max(
              ...activityStats.map((item) => item.bookings),
              1
            );

            const percentage =
              (activity.bookings / maxBookings) * 100;

            return (
              <div key={activity.name}>
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-[#0C1226]">
                    {activity.name}
                  </span>

                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{activity.bookings} bookings</span>
                    <span className="font-semibold text-[#147D9F]">
                      {activity.revenue.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#147D9F] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {activityStats.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              No activity data available for this period.
            </p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-bold text-[#0C1226]">
            Booking Report
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#147D9F]">
                    {booking.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking.activity}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.date}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#0C1226]">
                    {booking.amount.toLocaleString()} EGP
                  </td>

                  <td className="px-6 py-4">
                    <BookingStatus status={booking.status} />
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No bookings found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        البيانات المعروضة هنا تجريبية ثابتة داخل الواجهة، وليست تقارير
        فعلية من الحجوزات أو الإيرادات. سيتم ربطها بالـ Backend لاحقًا.
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-[#0C1226]">
          {value}
        </p>
      </div>

      <div className="rounded-xl bg-[#147D9F]/10 p-3 text-[#147D9F]">
        {icon}
      </div>
    </div>
  );
}

function StatusCard({ title, count, color, percentage }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="text-xl font-bold text-[#0C1226]">{count}</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        {percentage.toFixed(0)}% of filtered bookings
      </p>
    </div>
  );
}

function BookingStatus({ status }) {
  const styles = {
    Confirmed: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}