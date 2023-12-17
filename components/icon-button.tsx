"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";

interface Props {
  Icon: LucideIcon;
  className?: string;
  IconClassName?: string;
  onClick?: (e: MouseEvent) => void;
}

export const IconButton = ({ Icon, className, IconClassName, onClick }: Props) => {
  return (
    <button
      className={cn("p-1.5 rounded-full text-zinc-600 hover:bg-gray-200 dark:hover:bg-stone-800 cursor-pointer", className)}
      onClick={onClick}
      type="button">
      <Icon className={cn("h-6 w-6", IconClassName)} />
    </button>
  );
};
