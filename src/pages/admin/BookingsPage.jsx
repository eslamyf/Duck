import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  CalendarCheck,
  ClipboardList,
} from 'lucide-react';

const BOOKINGS_KEY = 'duck_bookings';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function readBookings() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(BOOKINGS_KEY) || '[]'
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function getBookingStatus(booking) {
  const rawStatus = String(
    booking.status || booking.bookingStatus || 'pending'
  ).toLowerCase();

  if (
    ['confirmed', 'confirm', 'paid', 'success'].includes(rawStatus)
  ) {
    return 'confirmed';
  }

  if (
    ['completed', 'complete', 'finished'].includes(rawStatus)
  ) {
    return 'completed';
  }

  if (
    ['cancelled', 'canceled', 'rejected'].includes(rawStatus)
  ) {
    return 'cancelled';
  }

  return 'pending';
}

function getBookingCustomer(booking) {
  return (
    booking.customerName ||
    booking.fullName ||
    booking.customer?.fullName ||
    booking.customer?.name ||
    booking.user?.fullName ||
    'Guest Customer'
  );
}

function getBookingActivity(booking) {
  return (
    booking.activityName ||
    booking.activityTitle ||
    booking.activity?.title ||
    booking.activity?.name ||
    booking.tripName ||
    booking.trip?.title ||
    'Water Activity'
  );
}

function getBookingReference(booking) {
  return (
    booking.reference ||
    booking.bookingReference ||
    booking.bookingCode ||
    booking.id ||
    'N/A'
  );
}

function getBookingDate(booking) {
  return (
    booking.date ||
    booking.bookingDate ||
    booking.activityDate ||
    booking.selectedDate ||
    ''
  );
}

function getBookingTime(booking) {
  return (
    booking.time ||
    booking.bookingTime ||
    booking.slot ||
    booking.selectedTime ||
    ''
  );
}

function getBookingGuests(booking) {
  return (
    booking.participants ||
    booking.guests ||
    booking.guestCount ||
    booking.numberOfGuests ||
    booking.people ||
    1
  );
}

function getBookingAmount(booking) {
  return (
    booking.totalAmount ??
    booking.totalPrice ??
    booking.amount ??
    booking.price ??
    0
  );
}

function formatDate(dateValue) {
  if (!dateValue) return 'Not specified';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0;

  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-[#0C1226]">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function BookingStatus({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {STATUS_LABELS[status] || 'Pending'}
    </span>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(() => readBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) => getBookingStatus(booking) === 'pending'
      ).length,

      confirmed: bookings.filter(
        (booking) => getBookingStatus(booking) === 'confirmed'
      ).length,

      completed: bookings.filter(
        (booking) => getBookingStatus(booking) === 'completed'
      ).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      const matchesStatus =
        statusFilter === 'all' || status === statusFilter;

      const searchableText = [
        getBookingReference(booking),
        getBookingCustomer(booking),
        getBookingActivity(booking),
        booking.email,
        booking.customer?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((booking) => {
      if (String(booking.id) !== String(bookingId)) {
        return booking;
      }

      return {
        ...booking,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    setBookings(updatedBookings);

    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify(updatedBookings)
    );

    setSelectedBooking(null);
  };

  const refreshBookings = () => {
    setBookings(readBookings());
  };

  return (
    <div className="space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#147D9F]">
            Duck Management
          </p>

          <h1 className="text-2xl font-black text-[#0C1226] sm:text-3xl">
            Bookings Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View, search and manage all customer bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshBookings}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          description="All registered bookings"
          icon={ClipboardList}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          description="Waiting for confirmation"
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          description="Confirmed reservations"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          description="Successfully completed"
          icon={CalendarCheck}
          iconClass="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Bookings Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0C1226]">
              All Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search bookings..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#147D9F] focus:bg-white sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-[#147D9F] sm:w-44"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Booking</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Activity</th>
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4">Guests</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => {
                const status = getBookingStatus(booking);
                const bookingId = booking.id;

                return (
                  <tr
                    key={bookingId || getBookingReference(booking)}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#0C1226]">
                        {getBookingReference(booking)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Booking ID
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {getBookingCustomer(booking)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {booking.email ||
                          booking.customer?.email ||
                          'No email'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {getBookingActivity(booking)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        {formatDate(getBookingDate(booking))}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {getBookingTime(booking) || 'Time not specified'}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {getBookingGuests(booking)}
                    </td>

                    <td className="px-5 py-4 text-sm font-black text-[#0C1226]">
                      {formatCurrency(getBookingAmount(booking))}
                    </td>

                    <td className="px-5 py-4">
                      <BookingStatus status={status} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBooking(booking)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#147D9F] hover:bg-blue-50 hover:text-[#147D9F]"
                        aria-label="View booking details"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CalendarDays size={28} />
              </div>

              <h3 className="text-lg font-black text-[#0C1226]">
                No bookings found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search || statusFilter !== 'all'
                  ? 'Try changing your search or filter.'
                  : 'Customer bookings will appear here once they are created.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1226]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#147D9F]">
                  Booking Details
                </p>

                <h2 className="mt-2 text-xl font-black text-[#0C1226]">
                  {getBookingReference(selectedBooking)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close details"
              >
                <XCircle size={19} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Customer
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {getBookingCustomer(selectedBooking)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Activity
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {getBookingActivity(selectedBooking)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatDate(getBookingDate(selectedBooking))}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Guests
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {getBookingGuests(selectedBooking)}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Update Booking Status
                </label>

                <select
                  id="booking-status"
                  value={getBookingStatus(selectedBooking)}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedBooking.id,
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#147D9F]"
                >
                  {STATUS_OPTIONS.filter(
                    (option) => option.value !== 'all'
                  ).map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-xl bg-[#0C1226] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#147D9F]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}