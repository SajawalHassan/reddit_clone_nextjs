import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { IconButton } from "@/components/icon-button";

export const NoPostsUser = ({ text }: { text: string }) => {
  return (
    <div className="relative">
      <div className="space-y-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div className="home-component bg-gray-200/50 dark:bg-[#1a1a1a] opacity-70 h-[6rem] p-2 rounded-l-md space-y-2 flex flex-col" key={i}>
            <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
            <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 mx-auto top-[60px] text-center w-max space-y-2">
        <p className="text-3xl font-semibold">┏(-_-)┛</p>
        <p className="text-lg font-semibold">{text}</p>
      </div>
    </div>
  );
};
