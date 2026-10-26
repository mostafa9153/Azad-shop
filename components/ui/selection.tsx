import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-[#1C1B18]"
      >
        <div className="relative flex items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded border border-[#14372E]/40 bg-[#FBF7F0] transition-colors peer-checked:bg-[#14372E] peer-checked:border-[#14372E] peer-focus-visible:ring-2 peer-focus-visible:ring-[#14372E]",
              className
            )}
          />
          <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-[#1C1B18]"
      >
        <div className="relative flex items-center justify-center">
          <input
            id={inputId}
            type="radio"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-full border border-[#14372E]/40 bg-[#FBF7F0] transition-colors peer-checked:border-[#14372E] peer-focus-visible:ring-2 peer-focus-visible:ring-[#14372E]",
              className
            )}
          />
          <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#14372E] opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border border-[#E9DDC9] bg-[#FBF7F0] px-3.5 py-2 text-sm text-[#1C1B18] shadow-xs transition-luxury focus-visible:outline-none focus-visible:border-[#14372E] focus-visible:ring-1 focus-visible:ring-[#14372E]",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
