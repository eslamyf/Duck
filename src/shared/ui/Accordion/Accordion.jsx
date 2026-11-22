import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Accordion({
  items = [],
  openId: controlledOpenId,
  onChange,
  allowMultiple = false,
  className = '',
}) {
  const [internalOpenIds, setInternalOpenIds] = useState(() => {
    if (controlledOpenId !== undefined) return new Set([controlledOpenId]);
    return items.length > 0 ? new Set([items[0].id]) : new Set();
  });

  const isControlled = controlledOpenId !== undefined;
  const currentOpenIds = isControlled
    ? new Set(Array.isArray(controlledOpenId) ? controlledOpenId : [controlledOpenId])
    : internalOpenIds;

  const handleToggle = useCallback((id) => {
    if (onChange) {
      onChange(id);
    }

    if (!isControlled) {
      setInternalOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    }
  }, [allowMultiple, isControlled, onChange]);

  if (!items || items.length === 0) return null;

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = currentOpenIds.has(item.id);
        const itemNumber = item.number || String(index + 1).padStart(2, '0');
        const headerId = `acc-header-${item.id}`;
        const panelId = `acc-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="border-b border-[rgba(18,21,40,0.1)] last:border-b-0"
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(item.id)}
                className="w-full flex items-center justify-between gap-3.5 min-h-[64px] min-[901px]:min-h-[72px] py-2.5 text-start cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg select-none"
              >
                {/* Leading 2-digit number (e.g. 01) */}
                <span
                  className="w-8 min-[901px]:w-10 flex-none text-brand-blue font-bold text-sm min-[901px]:text-base select-none tracking-tight"
                  aria-hidden="true"
                >
                  {itemNumber}
                </span>

                {/* Title */}
                <span className="flex-1 font-semibold text-[16.5px] min-[901px]:text-[19px] text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
                  {item.title || item.question}
                </span>

                {/* Plus / Minus Circular Indicator */}
                <span
                  className={`w-8.5 h-8.5 min-[901px]:w-9 min-[901px]:h-9 rounded-full border border-[rgba(20,125,159,0.22)] flex items-center justify-center text-sm leading-none flex-none transition-transform duration-300 ease-out select-none ${
                    isOpen
                      ? 'rotate-45 bg-brand-yellow text-brand-navy border-brand-yellow shadow-sm'
                      : 'bg-white text-brand-navy group-hover:border-brand-blue'
                  }`}
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                </span>
              </button>
            </h3>

            {/* Expandable Content Panel */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <div className="ps-8 min-[901px]:ps-10 pe-2 pb-5 text-brand-navy/80 text-[14.5px] min-[901px]:text-base leading-relaxed max-w-[68ch]">
                  {typeof (item.content || item.answer) === 'string' ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: item.content || item.answer }}
                      className="[&>ul]:list-disc [&>ul]:ps-5 [&>ul]:space-y-1 [&>p]:mb-2 [&_b]:text-brand-navy [&_strong]:text-brand-navy"
                    />
                  ) : (
                    item.content || item.answer
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
