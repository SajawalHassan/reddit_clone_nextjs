import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  text: string;
}

export const HeaderProfileMenuHeading = ({ Icon, text }: Props) => {
  return (
    <div className="flex items-center gap-x-2 text-zinc-500 pl-4 text-sm">
      <Icon className="h-5 w-5" />
      <p className="font-semibold">{text}</p>
    </div>
  );
};
