import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-[#E9DDC9] bg-[#FBF7F0] px-3.5 py-2 text-sm text-[#1C1B18] shadow-xs transition-luxury placeholder:text-[#1C1B18]/40 focus-visible:outline-none focus-visible:border-[#14372E] focus-visible:ring-1 focus-visible:ring-[#14372E] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[90px] w-full rounded-md border border-[#E9DDC9] bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-[#1C1B18] shadow-xs transition-luxury placeholder:text-[#1C1B18]/40 focus-visible:outline-none focus-visible:border-[#14372E] focus-visible:ring-1 focus-visible:ring-[#14372E] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
