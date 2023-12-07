"use client";

import { useFeedQuery } from "@/hooks/use-feed-query";
import { Home, Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostHomeComponent } from "@/components/posts/post-home-component";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { useEffect } from "react";

export const HomeFeed = () => {
  const query = "feed:home";

  const { data, fetchNextPage, hasNextPage, status } = useFeedQuery({ query, apiUrl: "/api/posts" });
  const { setHeaderActivePlace } = useGlobalInfo();

  let posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.feedItems];
  }, []);

  useEffect(() => {
    setHeaderActivePlace({ text: "Home", icon: "Home" });
  }, []);

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
        className="mt-2 space-y-2 pb-10">
        {posts?.map((post: PostWithMemberWithProfileWithCommunityWithVotes) => (
          <PostHomeComponent post={post} key={post.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
