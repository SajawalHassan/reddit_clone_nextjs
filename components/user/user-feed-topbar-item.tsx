import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  link: string;
  content: string;
  isActive?: boolean;
}

export const UserFeedTopbarItem = ({ link, content, isActive = false }: Props) => {
  return (
    <Link
      href={link}
      className={cn(
        "font-semibold text-sm uppercase border-b py-2",
        isActive
          ? "border-blue-500 text-blue-500 cursor-default"
          : "border-transparent text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500"
      )}>
      {content}
    </Link>
  );
};
