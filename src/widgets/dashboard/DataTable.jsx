import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

/**
 * Unified DataTable (Desktop Table + Mobile Cards) aligned with Final_4.html (.ptbl-w).
 */
export default function DataTable({
  columns = [],
  rows = [],
  rowKey = (row, idx) => row.id ?? idx,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  activeFilter,
  onFilterChange,
  emptyTitle,
  emptyDescription,
  headerActions,
}) {
  return (
    <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white shadow-card overflow-hidden">
      {(onSearchChange || filters.length > 0 || headerActions) && (
        <div className="flex flex-col gap-3 border-b border-brand-blue/12 p-4 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-navy/40"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 py-2.5 ps-9 pe-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:bg-surface-white"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => onFilterChange?.(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-brand-navy text-brand-yellow shadow-xs'
                      : 'bg-surface-mist text-brand-navy/75 hover:bg-surface-mist2'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            {headerActions}
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="border-b border-brand-blue/15 bg-surface-mist text-xs font-bold uppercase text-brand-navy/75">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3.5 text-start ${col.headerClassName || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-navy/8">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length || 1} className="px-6 py-12 text-center">
                  <p className="text-sm font-bold text-brand-navy">{emptyTitle}</p>
                  {emptyDescription && (
                    <p className="mt-1 text-xs text-brand-navy/55">{emptyDescription}</p>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={rowKey(row, idx)} className="transition-colors hover:bg-surface-mist/40">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 align-middle text-brand-navy ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (< md) */}
      <div className="divide-y divide-brand-navy/10 md:hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-bold text-brand-navy">{emptyTitle}</p>
            {emptyDescription && (
              <p className="mt-1 text-xs text-brand-navy/55">{emptyDescription}</p>
            )}
          </div>
        ) : (
          rows.map((row, idx) => (
            <div key={rowKey(row, idx)} className="space-y-2 p-4">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-brand-navy/55">{col.label}</span>
                  <div className={`text-end text-brand-navy ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row, idx) : row[col.key]}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
