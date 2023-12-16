import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";

interface Props {
  Icon: LucideIcon;
  text: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  IconClassName?: string;
  textClassName?: string;
}

export const PostHomeComponentFooterItem = ({ Icon, text, onClick, className, IconClassName, textClassName }: Props) => {
  return (
    <div
      className={cn("flex items-center gap-x-2 py-1.5 px-1.5 hover:bg-gray-200 cursor-pointer dark:text-white dark:hover:bg-zinc-700", className)}
      onClick={onClick}>
      <Icon className={cn("font-light h-5 w-5 text-zinc-500 dark:text-zinc-400", IconClassName)} />
      <p className={cn("text-xs font-semibold text-zinc-500 dark:text-zinc-400", textClassName)}>{text}</p>
    </div>
  );
};
