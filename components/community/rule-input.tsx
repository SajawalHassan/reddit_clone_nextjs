import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";

interface AddRuleInputProps {
  cancelOnClick?: () => void;
  saveOnClick?: () => void;
  className?: string;
  isLoading?: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const RuleInput = ({ cancelOnClick, saveOnClick, value, setValue, className, isLoading }: AddRuleInputProps) => {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-input bg-gray-100 dark:bg-[#272729] focus-within:dark:bg-[#1A1A1B] focus-within:dark:border-white hover:bg-white hover:border-blue-500 focus-within:bg-white focus-within:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white border-gray-200 dark:border-[#3c3c3d] px-3 pt-1 text-sm",
        className
      )}>
      <Input
        placeholder="Add a rule"
        className="bg-transparent dark:bg-transparent dark:hover:bg-transparent border-none p-0"
        autoFocus={true}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
      <Separator className="mb-2 mt-0" />
      <div className="flex items-center gap-x-2 mb-2">
        <p
          className={cn("text-xs font-bold text-red-500", isLoading ? "text-opacity-60 cursor-not-allowed" : "cursor-pointer")}
          onClick={cancelOnClick}>
          Cancel
        </p>
        <p
          className={cn("text-xs font-bold text-blue-500", isLoading ? "text-opacity-60 cursor-not-allowed" : "cursor-pointer")}
          onClick={saveOnClick}>
          Save
        </p>
      </div>
    </div>
  );
};
