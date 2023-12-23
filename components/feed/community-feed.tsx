"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useFeedQuery } from "@/hooks/use-feed-query";
import { Loader2 } from "lucide-react";
import { PostHomeComponent } from "@/components/home-components/post/post-home-component";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useEffect, useState } from "react";
import { NoPostsCommunity } from "@/components/community/no-posts-community";
import { useFeedInfo } from "@/hooks/use-feed-info";

export const CommunityFeed = ({ communityId }: { communityId: string }) => {
  const [posts, setPosts] = useState<PostWithMemberWithProfileWithCommunityWithVotes[]>([]);

  const query = `feed:community:${communityId}`;

  const { setFeedPosts } = useFeedInfo();
  const { data, fetchNextPage, hasNextPage, status, refetch } = useFeedQuery({
    query,
    apiUrl: "/api/communities/feed",
    communityId,
    feedType: "hot",
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setPosts(
      data?.pages?.reduce((prev: any, current: any) => {
        return [...prev, ...current.feedItems];
      }, [])
    );
  }, [data]);

  useEffect(() => {
    if (posts) setFeedPosts(posts);
  }, [posts]);

  if (status === "loading" || !posts) {
    return (
      <div className="home-component-container px-2">
        <FeedLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="home-component-container">
      {posts.length !== 0 ? (
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
            <PostHomeComponent post={post} key={post.id} />
          ))}
        </InfiniteScroll>
      ) : (
        <NoPostsCommunity communityId={communityId} />
      )}
    </div>
  );
};
