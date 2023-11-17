import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const HeaderSearch = () => {
  return (
    <div className="flex items-center gap-x-2 flex-grow rounded-full bg-gray-100 dark:bg-[#272729] dark:border-[#3c3c3d] border border-gray-200 px-4 hover:bg-white hover:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white focus-within:bg-white focus-within:border-blue-500 focus-within:dark:bg-[#1A1A1B] focus-within:dark:border-white">
      <Search className="text-zinc-600" />
      <Input placeholder="Search Reddit" className="bg-transparent border-none focus-within:ring-0 focus-within:ring-offset-0 " />
    </div>
  );
};
