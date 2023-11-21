import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  Icon: LucideIcon;
  text: string;
  isActive?: boolean;
  type: "plain" | "media" | "link";
}

export const PostTypeItem = ({ Icon, text, isActive, type }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const changeType = () => {
    router.push(`${pathname}?${type}=true`);
    router.refresh();
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-x-2 w-full border py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800",
        isActive ? "text-blue-600 dark:text-white border-b-blue-600 dark:border-b-white border-b-[3px]" : "text-zinc-500"
      )}
      onClick={changeType}>
      <Icon className="h-6 w-6" />
      <p className="font-bold text-sm truncate">{text}</p>
    </div>
  );
};
