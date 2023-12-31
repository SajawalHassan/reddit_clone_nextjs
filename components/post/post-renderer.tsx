"use client";

import axios from "axios";
import qs from "query-string";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { useEffect, useState } from "react";
import { AboutCommunitiyHomeComponent } from "@/components/home-components/about-community-home-component";
import { CommunityRules } from "@/components/community/community-rules";
import { PostHomeComponent } from "@/components/home-components/post/post-home-component";
import { Image, Link, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostSkeleton } from "@/components/skeletons/post-skeleton";
import { PostComments } from "./comments/post-comments";
import { useFeedInfo } from "@/hooks/use-feed-info";

export const PostRenderer = ({ postId, communityId }: { postId: string; communityId: string }) => {
  const [post, setPost] = useState<PostWithMemberWithProfileWithCommunityWithVotes>();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { feedPosts, setFeedPosts } = useFeedInfo();

  useEffect(() => {
    const getPost = async (postId: string) => {
      const feedPost = feedPosts.filter((feedPost) => feedPost.id === postId)[0];
      if (feedPost) {
        setIsLoading(false);
        return setPost(feedPost);
      }

      try {
        setIsLoading(true);
        const url = qs.stringifyUrl({ url: "/api/posts/specific", query: { postId } });
        const response = await axios.get(url);

        const post = response.data;
        if (!post) return;
        setPost(post);
        setFeedPosts([...feedPosts, post]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getPost(postId);
  }, []);

  useEffect(() => {
    router.prefetch(`/main/communities/${communityId}`);
    router.prefetch(`/main`);
  }, []);

  return (
    <div className="w-full flex flex-grow mt-[3rem] px-0 justify-center bg-[#2E2F2F] dark:bg-[#252525]" onClick={() => router.back()}>
      <div className="w-full max-w-[80rem] gap-x-4 bg-[#DAE0E6] dark:bg-[#1A1A1B] min-h-screen" onClick={(e) => e.stopPropagation()}>
        {post && (
          <div className="bg-black py-2 px-2 text-white flex justify-center">
            <div className="w-full max-w-[741px] xl:max-w-[1077px] flex items-center justify-between">
              <div className="flex items-center gap-x-2 max-w-[90%]">
                {post.content ? (
                  <div className="border p-1 rounded-sm">
                    <Menu className="text-white min-h-4 min-w-4" />
                  </div>
                ) : post.imageUrl ? (
                  <Image className="text-white min-h-5 min-w-5" />
                ) : post.link ? (
                  <Link className="text-white min-h-5 min-w-5" />
                ) : (
                  <div className="border p-1 rounded-sm">
                    <Menu className="text-white h-4 w-4" />
                  </div>
                )}
                <p className="font-semibold truncate">{post.title}</p>
              </div>
              <div className="flex items-center gap-x-1 cursor-pointer" onClick={() => router.back()}>
                <X className="h-5 w-5" />
                <p className="font-semibold text-sm text-gray-200">Close</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-x-3 py-2 justify-center">
          {isLoading ? (
            <PostSkeleton />
          ) : (
            <div className="md:min-w-[760px] md:max-w-[760px] md:w-[760px] relative">
              <PostHomeComponent post={post!} isOnPostPage={true} />
              <PostComments post={post!} />
            </div>
          )}
          <div className="hidden xl:block space-y-4">
            <AboutCommunitiyHomeComponent communityId={communityId} showMoreInfo={true} />
            <CommunityRules communityId={communityId} />
          </div>
        </div>
      </div>
    </div>
  );
};
