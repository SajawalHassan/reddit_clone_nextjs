import { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dispatch, SetStateAction } from "react";

interface Props {
  text: string;
  Icon?: LucideIcon;
  useSwitch?: boolean;
  switchValue?: boolean;
  switchFunction?: () => void;
  onClick?: () => void;
  setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const HeaderProfileMenuItem = ({ Icon, text, useSwitch = false, switchFunction, onClick, switchValue, setMenuIsOpen }: Props) => {
  const handleOnClick = () => {
    onClick ? onClick() : switchFunction!();
    onClick && setMenuIsOpen(false);
  };

  return (
    <div
      className="flex items-center justify-between pl-8 pr-2 py-2 hover:bg-gray-200 dark:hover:bg-zinc-800 text-sm cursor-pointer"
      onClick={handleOnClick}>
      <div className="flex items-center gap-x-2">
        {Icon && <Icon className="h-5 w-5" />}
        <p className="font-semibold">{text}</p>
      </div>
      {useSwitch && <Switch checked={switchValue} />}
    </div>
  );
};
