import { Separator } from "@/components/ui/seperator";

export const AboutCommunitySkeleton = () => {
  return (
    <div className="home-component p-0 w-[20rem]">
      <div className="py-3 px-2 bg-white dark:bg-[#151516]">
        <div className="flex items-center gap-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-zinc-800 animate-pulse" />
          <div className="bg-gray-300 dark:bg-zinc-800 p-2.5 w-[90%] rounded-sm animate-pulse" />
        </div>
        <div className="bg-gray-300 dark:bg-zinc-800 p-1.5 mt-2 w-[70%] rounded-sm animate-pulse" />
        <Separator className="my-4" />
        <div className="bg-gray-300 dark:bg-zinc-800 p-1.5 mt-2 w-[80%] rounded-sm animate-pulse" />
        <div className="bg-gray-300 dark:bg-zinc-800 p-2 mt-2 w-[90%] rounded-sm animate-pulse" />
        <Separator className="my-4" />
        <div className="bg-gray-300 dark:bg-zinc-800 p-3 w-full rounded-sm animate-pulse" />
      </div>
    </div>
  );
};
