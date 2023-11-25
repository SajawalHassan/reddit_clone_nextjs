"use client";

import { useFeedQuery } from "@/hooks/use-feed-query";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostFeedHomeComponent } from "./post-feed-home-component";
import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { useEffect } from "react";

export const HomeFeed = () => {
  const query = "feed:home";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeedQuery({ query, apiUrl: "/api/posts" });

  let posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.feedItems];
  }, []);

  useEffect(() => {
    // Remove duplicates just in case
    posts = posts?.filter((post: any, index: number) => posts?.indexOf(post) === index);
  }, [posts]);

  console.log(posts?.length);

  return (
    <InfiniteScroll
      dataLength={posts ? posts.length : 0}
      next={() => fetchNextPage()}
      hasMore={hasNextPage ? true : false}
      loader={
        <div className="w-full flex items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
      className="overflow-auto m-0">
      {posts?.map((post: PostWithMemberWithProfileWithCommunity) => (
        <PostFeedHomeComponent post={post} key={post.id} />
      ))}
    </InfiniteScroll>
  );
};
