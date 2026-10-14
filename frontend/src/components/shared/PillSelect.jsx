/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

const PILL =
  "w-full text-xs border border-gray-400 dark:border-gray-600 rounded-full px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none min-w-0 max-w-full";

export default function PillSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      setOpenUp(spaceBelow < 230 && r.top > spaceBelow);
    }
    setOpen((o) => !o);
  };

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${PILL} inline-flex items-center justify-between gap-2 cursor-pointer text-left`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute z-50 left-0 right-0 max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg ${
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((o) => {
            const active = String(o.value) === String(value);
            return (
              <li key={String(o.value)} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
