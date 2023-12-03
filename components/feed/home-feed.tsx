"use client";

import { useFeedQuery } from "@/hooks/use-feed-query";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostHomeComponent } from "@/components/posts/post-home-component";
import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";

export const HomeFeed = () => {
  const query = "feed:home";

  const { data, fetchNextPage, hasNextPage, status } = useFeedQuery({ query, apiUrl: "/api/posts" });

  let posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.feedItems];
  }, []);

  useEffect(() => {
    // Remove duplicates just in case
    posts = posts?.filter((post: any, index: number) => posts?.indexOf(post) === index);
  }, [posts]);

  if (status === "loading") {
    return (
      <div className="home-component-container px-2">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="home-component-container">
      <InfiniteScroll
        dataLength={posts ? posts.length : 0}
        next={() => fetchNextPage()}
        hasMore={hasNextPage ? true : false}
        loader={
          <div className="w-full flex items-center justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
        className="overflow-auto mt-2 space-y-2">
        {posts?.map((post: PostWithMemberWithProfileWithCommunity) => (
          <PostHomeComponent post={post} key={post.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
