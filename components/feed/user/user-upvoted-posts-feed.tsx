"use client";

import qs from "query-string";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import { PostHomeComponent } from "@/components/home-components/post/post-home-component";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useFeedInfo } from "@/hooks/use-feed-info";
import { useFeedQuery } from "@/hooks/use-feed-query";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NoPostsUser } from "@/components/user/no-posts-user";
import { useProfileInfo } from "@/hooks/use-profile-info";

export const UserUpvotedPostsFeed = ({ profileId }: { profileId: string }) => {
  const [posts, setPosts] = useState<PostWithMemberWithProfileWithCommunityWithVotes[]>([]);

  const { viewingProfile, setViewingProfile } = useProfileInfo();

  const query = `feed:user:${viewingProfile?.id}:posts:upvoted`;

  const { setFeedPosts } = useFeedInfo();
  const { data, fetchNextPage, hasNextPage, status, refetch } = useFeedQuery({
    query,
    apiUrl: "/api/users/feed/upvoted",
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
        if (error.response.status === 401) console.log("Unauthorized");
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
            <PostHomeComponent post={post} key={post.id} />
          ))}
        </InfiniteScroll>
      ) : (
        <NoPostsUser text="This user has not upvoted any posts" />
      )}
    </div>
  );
};
