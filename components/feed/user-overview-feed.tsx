"use client";

import { PostAndCommentsHomeComponent } from "@/components/home-components/post/post-and-comments-home-component";
import { PostHomeComponent } from "@/components/home-components/post/post-home-component";
import { CommentList } from "@/components/post/comments/comment-list";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useFeedInfo } from "@/hooks/use-feed-info";
import { useFeedQuery } from "@/hooks/use-feed-query";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export const UserOverviewFeed = () => {
  const [posts, setPosts] = useState<PostWithMemberWithProfileWithCommunityWithVotes[]>([]);

  const { profile } = useGlobalInfo();

  const query = `feed:community:${profile?.id}`;

  const { setFeedPosts } = useFeedInfo();
  const { data, fetchNextPage, hasNextPage, status, refetch } = useFeedQuery({
    query,
    apiUrl: "/api/users/feed",
    profileId: profile?.id,
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
          <PostAndCommentsHomeComponent post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
