"use client";

import { useFeedQuery } from "@/hooks/use-feed-query";
import { Post } from "@prisma/client";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostFeedComponent } from "./post-feed-component";
import { PostWithMemberWithCommunity } from "@/types";

export const HomeFeed = () => {
  const query = "feed:home";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeedQuery({ query, apiUrl: "/api/posts" });

  const posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.items];
  }, []);

  return (
    <InfiniteScroll
      dataLength={posts ? posts?.length : 0}
      next={() => fetchNextPage()}
      hasMore={hasNextPage ? true : false}
      loader={<Loader2 className="h-6 w-6 animate-spin" />}>
      {posts?.map((post: PostWithMemberWithCommunity) => (
        <PostFeedComponent post={post} key={post.id} />
      ))}
    </InfiniteScroll>
  );
};
