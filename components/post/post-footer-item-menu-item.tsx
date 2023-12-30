import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";

interface Props {
  Icon: LucideIcon;
  text: string;
  onClick: (e: MouseEvent) => void;
}

export const PostFooterItemMenuItem = ({ Icon, text, onClick }: Props) => {
  return (
    <div
      className="flex items-center py-2 px-2 gap-x-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-700 dark:text-zinc-200"
      onClick={onClick}>
      <Icon className="h-5 w-5" />
      <p className="font-semibold text-sm hidden">{text}</p>
    </div>
  );
};
