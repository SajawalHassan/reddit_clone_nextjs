import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        " h-10 w-full rounded-md border border-input bg-gray-100 dark:bg-[#272729] focus:dark:bg-[#1A1A1B] focus:dark:border-white hover:bg-white hover:border-blue-500 focus:bg-white focus:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white border-gray-200 dark:border-[#3c3c3d] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
