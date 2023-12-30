"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import qs from "query-string";

import { PostAndCommentsHomeComponent } from "@/components/home-components/post/post-and-comments-home-component";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useFeedInfo } from "@/hooks/use-feed-info";
import { useFeedQuery } from "@/hooks/use-feed-query";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { redirectToSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NoPostsUser } from "@/components/user/no-posts-user";
import { useProfileInfo } from "@/hooks/use-profile-info";

export const UserOverviewFeed = ({ profileId }: { profileId: string }) => {
  const [posts, setPosts] = useState<PostWithMemberWithProfileWithCommunityWithVotes[]>([]);

  const { viewingProfile, setViewingProfile } = useProfileInfo();

  const query = `feed:user:${viewingProfile?.id}:overview`;

  const { setFeedPosts } = useFeedInfo();
  const { data, fetchNextPage, hasNextPage, status, refetch } = useFeedQuery({
    query,
    apiUrl: "/api/users/feed",
    profileId: profileId,
    feedType: "hot",
  });

  useEffect(() => {
    const getViewingProfile = async () => {
      if (viewingProfile !== null && viewingProfile.id === profileId) return;

      setViewingProfile(null);
      try {
        const url = qs.stringifyUrl({ url: "/api/profile/specific", query: { profileId } });
        const res = await axios.get(url);

        setViewingProfile(res.data);
      } catch (error: any) {
        if (error.response.status === 401) redirectToSignIn();
        else console.log(error);
      }
    };

    getViewingProfile();
  }, []);

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
      {posts?.length > 0 ? (
        <InfiniteScroll
          dataLength={posts ? posts.length : 0}
          next={() => fetchNextPage()}
          hasMore={hasNextPage ? true : false}
          loader={
            <div className="w-full flex items-center justify-center p-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
          className="space-y-2 pb-20">
          {posts?.map((post: PostWithMemberWithProfileWithCommunityWithVotes) => (
            <PostAndCommentsHomeComponent post={post} key={post.id} />
          ))}
        </InfiniteScroll>
      ) : (
        <NoPostsUser text="This user has not created any posts" />
      )}
    </div>
  );
};
