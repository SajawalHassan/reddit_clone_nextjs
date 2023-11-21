import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

interface Props {
  text: string;
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  disabled: boolean;
}

export const PostTagItem = ({ text, isActive, onChange, disabled }: Props) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-x-2 border border-black dark:border-zinc-400 rounded-full w-[7rem] text-zinc-600 dark:text-zinc-400 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed",
        isActive && "bg-black dark:bg-black border-transparent dark:border-transparent text-white dark:text-white hover:bg-black hover:dark:bg-black"
      )}
      onClick={() => onChange(!isActive)}
      type="button"
      disabled={disabled}>
      {isActive ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      <p className="font-semibold">{text}</p>
    </button>
  );
};
