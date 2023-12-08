import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";

interface Props {
  Icon: LucideIcon;
  text: string;
  onClick?: (e: MouseEvent) => void;
}

export const PostHomeComponentFooterItem = ({ Icon, text, onClick }: Props) => {
  return (
    <div
      className="flex items-center gap-x-2 py-1.5 px-1.5  hover:bg-gray-200 cursor-pointer dark:text-white dark:hover:bg-zinc-700"
      onClick={onClick}>
      <Icon className="font-light h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{text}</p>
    </div>
  );
};
