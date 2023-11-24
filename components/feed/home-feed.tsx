"use client";

import { useFeedQuery } from "@/hooks/use-feed-query";
import { Post } from "@prisma/client";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostFeedComponent } from "./post-feed-component";
import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { useEffect } from "react";

export const HomeFeed = () => {
  const query = "feed:home";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeedQuery({ query, apiUrl: "/api/posts" });

  let posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.feedItems];
  }, []);

  console.log(data?.pages);
  console.log(posts);

  return (
    <InfiniteScroll
      dataLength={posts ? posts.length : 0}
      next={() => fetchNextPage()}
      hasMore={hasNextPage ? true : false}
      loader={<Loader2 className="h-6 w-6 animate-spin" />}>
      {posts?.map((post: PostWithMemberWithProfileWithCommunity) => (
        <PostFeedComponent post={post} key={post.id} />
      ))}
    </InfiniteScroll>
  );
};
