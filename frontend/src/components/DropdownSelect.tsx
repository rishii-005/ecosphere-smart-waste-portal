import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option<T extends string> {
  label: string;
  value: T;
}

interface DropdownSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<Option<T>>;
  placeholder?: string;
  className?: string;
}

export function DropdownSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = ""
}: DropdownSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="field flex items-center justify-between gap-3 text-left font-semibold"
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#1a2220]"
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left font-semibold transition ${
                    active
                      ? "bg-mint/18 text-ink dark:bg-mint/20 dark:text-white"
                      : "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                  }`}
                >
                  <span>{option.label}</span>
                  {active && <Check size={16} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
