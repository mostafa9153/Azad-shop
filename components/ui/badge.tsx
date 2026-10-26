import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        forest: "bg-[#14372E] text-[#FBF7F0]",
        sand: "bg-[#E9DDC9] text-[#1C1B18]",
        gold: "bg-[#A8834A]/20 text-[#A8834A] border border-[#A8834A]/40",
        sage: "bg-[#DDE5DB] text-[#14372E]",
        outline: "border border-[#14372E]/30 text-[#14372E]",
        sale: "bg-red-600 text-white font-semibold",
        new: "bg-[#14372E] text-white",
        soldOut: "bg-neutral-200 text-neutral-600 line-through",
      },
    },
    defaultVariants: {
      variant: "sand",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
