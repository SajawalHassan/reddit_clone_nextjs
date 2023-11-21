"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

export const IconButton = ({ Icon, className, onClick }: Props) => {
  return (
    <div className={cn("p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer", className)} onClick={onClick}>
      <Icon className="h-6 w-6" />
    </div>
  );
};
