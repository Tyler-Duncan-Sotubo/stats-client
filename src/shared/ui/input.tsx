import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // ✅ UPDATED BASE STYLES
        "h-10 w-full min-w-0 rounded-[10px] border-[1.5px] text-base border-[#D9E2F0] bg-white px-4 text-[#031B35] outline-none transition-colors",

        // placeholder + focus
        "placeholder:text-gray-400 focus-visible:border-[#0066FF] focus-visible:ring-0",

        // states
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500",

        className,
      )}
      {...props}
    />
  );
}

export { Input };
