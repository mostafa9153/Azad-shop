import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        forest:
          "bg-[#14372E] text-[#FBF7F0] hover:bg-[#1D4C40] focus-visible:ring-[#14372E] shadow-sm",
        sand:
          "bg-[#E9DDC9] text-[#1C1B18] hover:bg-[#DDD0BC] focus-visible:ring-[#A8834A]",
        gold:
          "bg-[#A8834A] text-[#FBF7F0] hover:bg-[#8F6F3E] focus-visible:ring-[#A8834A] shadow-sm",
        outline:
          "border border-[#14372E]/25 text-[#14372E] bg-transparent hover:bg-[#14372E]/5 focus-visible:ring-[#14372E]",
        ghost:
          "text-[#1C1B18] hover:bg-[#E9DDC9]/40 focus-visible:ring-[#14372E]",
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#20BA5A] focus-visible:ring-[#25D366] shadow-sm",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-md",
        md: "h-11 px-5 text-sm rounded-md",
        lg: "h-13 px-7 text-base rounded-lg font-semibold",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "forest",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
