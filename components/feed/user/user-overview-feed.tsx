"use client";

import { PostHomeComponent } from "@/components/home-components/post/post-home-component";
import { CommentList } from "@/components/post/comments/comment-list";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useFeedQuery } from "@/hooks/use-feed-query";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export const UserOverviewFeed = () => {
  const { profile } = useGlobalInfo();

  const query = `feed:community:${profile?.id}`;

  const { data, fetchNextPage, hasNextPage, status, refetch } = useFeedQuery({
    query,
    apiUrl: "/api/users/feed",
    profileId: profile?.id,
    feedType: "hot",
  });

  useEffect(() => {
    refetch();
  }, []);

  let posts = data?.pages?.reduce((prev: any, current: any) => {
    return [...prev, ...current.feedItems];
  }, []);

  if (status === "loading") {
    return (
      <div className="home-component-container px-2">
        <FeedLoadingSkeleton />
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
        className="mt-2 space-y-2 pb-20">
        {posts?.map((post: PostWithMemberWithProfileWithCommunityWithVotes) => (
          <>
            <PostHomeComponent post={post} className="rounded-sm border-transparent" votesClassName="bg-transparent" />
          </>
        ))}
      </InfiniteScroll>
    </div>
  );
};
