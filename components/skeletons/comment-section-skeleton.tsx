import { Separator } from "@/components/ui/seperator";

export const CommentSectionSkeleton = () => {
  // Add more numbers for more post skeletons
  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <div className="px-2">
      {skeletons.map((i) => (
        <div className="bg-white h-[8rem] w-full pt-2 pl-[3.5rem] flex" key={i}>
          <div className="bg-white dark:bg-[#151516] px-2 w-full rounded-r-md">
            <div className="bg-gray-300 dark:bg-zinc-800 p-1 w-[40%] rounded-sm animate-pulse" />
            <div className="bg-gray-300 dark:bg-zinc-800 p-6 mt-3 w-[80%] rounded-sm animate-pulse" />
            <div className="bg-gray-300 dark:bg-zinc-800 p-1 mt-4 w-[30%] rounded-sm animate-pulse" />
            <Separator className="my-2" />
          </div>
        </div>
      ))}
    </div>
  );
};
