import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  const handlePick = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div className="relative sm:w-48">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="input flex w-full items-center justify-between gap-2"
      >
        <span>{selected ? selected.label : "Select…"}</span>
        <ChevronDown size={16} className="shrink-0 text-ink-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePick(opt.value)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-ink-50"
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <Check size={15} className="text-brand-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
