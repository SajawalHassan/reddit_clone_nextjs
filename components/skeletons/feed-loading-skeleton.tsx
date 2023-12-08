import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { IconButton } from "../icon-button";

export const FeedLoadingSkeleton = () => {
  // Add more numbers for more post skeletons
  const skeletons = [1, 2, 3];

  return (
    <div className="home-component-container space-y-5">
      {skeletons.map((i) => (
        <div className="home-component h-[20rem] w-full p-0 flex" key={i}>
          <div className="w-[4rem] bg-gray-100 dark:bg-[#151516] p-2 flex flex-col items-center rounded-l-md space-y-2 h-full">
            <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max" />
            <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max" />
          </div>
          <div className="bg-white dark:bg-[#151516] px-2 py-2 w-full rounded-r-md">
            <div className="bg-gray-300 dark:bg-zinc-800 p-2 w-[70%] rounded-sm animate-pulse" />
            <div className="bg-gray-300 dark:bg-zinc-800 p-4 mt-2 w-full rounded-sm animate-pulse" />
            <div className="bg-gray-300 dark:bg-zinc-800 h-[78%] mt-2 w-full rounded-sm animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
