"use client";

import { PostWithComments } from "@/types";
import { format } from "date-fns";
import { MenuSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/seperator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const DATE_FORMAT = "d MMM";

export const RecentPosts = () => {
  const [visitedPosts, setVisitedPosts] = useState<PostWithComments[]>([]);

  useEffect(() => {
    const visitedPostsLS: any[] = JSON.parse(localStorage.getItem("visitedPosts") || "[]");
    setVisitedPosts(visitedPostsLS);
  }, []);

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const router = useRouter();

  const clearPostHistory = () => {
    localStorage.setItem("visitedPosts", "[]");
    setVisitedPosts([]);
  };

  return (
    <div className={cn(visitedPosts.length === 0 ? "hidden" : "home-component w-[20rem]")}>
      <p className="uppercase text-xs font-bold mb-2">Recent Posts</p>
      <div className="space-y-2">
        {visitedPosts.slice(0, 5).map((post: PostWithComments) => (
          <div key={post.id}>
            <div className="flex gap-x-2 cursor-pointer group" onClick={() => router.push(`/main/communities/${post.communityId}/post/${post.id}`)}>
              <div className="min-h-[4rem] min-w-[6rem] max-h-[4rem] max-w-[6rem]">
                {post.imageUrl ? (
                  <div className="overflow-hidden rounded-md h-full w-full">
                    <img src={post.imageUrl} alt={post.title} className="rounded-md" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-md border h-full w-full">
                    <MenuSquare className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between pb-0.5 truncate">
                <p className="font-semibold whitespace-pre-wrap group-hover:underline text-sm">{post.title}</p>
                <p className="text-sm text-gray-500">
                  {formatter.format(post.comments.length)} comments · {format(new Date(post.createdAt), DATE_FORMAT)}
                </p>
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
        <div className="text-right">
          <p className="text-gray-600 hover:underline text-sm cursor-pointer dark:text-stone-500" onClick={() => clearPostHistory()}>
            Clear
          </p>
        </div>
      </div>
    </div>
  );
};
