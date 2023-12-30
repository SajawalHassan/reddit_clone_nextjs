"use client";

import axios from "axios";
import qs from "query-string";

import { ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Member, MemberRole } from "@prisma/client";
import { FeedLoadingSkeleton } from "@/components/skeletons/feed-loading-skeleton";
import { useModal } from "@/hooks/use-modal-store";
import { useCommunityInfo } from "@/hooks/use-community-info";

export const NoPostsCommunity = ({ communityId }: { communityId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { openModal } = useModal();
  const { currentMember, setCurrentMember, community, setCommunity } = useCommunityInfo();

  const router = useRouter();

  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;
  const hasPrivilages = isAdmin || isModerator;

  useEffect(() => {
    const setMember = async () => {
      if (community && currentMember) return;

      setIsLoading(true);
      const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

      const response = await axios.get(url);
      setCurrentMember(response.data.currentMember[0]);
      setCommunity(response.data.community);
      setIsLoading(false);
    };
    setMember();
  }, []);

  if (isLoading)
    return (
      <div className="mx-2">
        <FeedLoadingSkeleton />
      </div>
    );

  const createPost = () => {
    if (!currentMember)
      return openModal("joinCommunity", { joinCommunityText: `In order to create a post in r/${community?.uniqueName} you must be a member.` });
    router.push(`/main/create/post?plain=true&preselected=${communityId}`);
  };

  return (
    <div className="mx-2">
      {hasPrivilages ? (
        <div className="home-component px-4">
          <p className="text-2xl font-semibold">Grow your community</p>
          <div className="mt-4 py-4 px-2 border flex gap-x-4">
            <IconButton
              Icon={Plus}
              className="p-1 bg-[#7193FF] hover:bg-[#84a0fc] w-max h-max"
              IconClassName="h-10 w-10 text-white font-light"
              onClick={createPost}
            />
            <div className="space-y-2">
              <p className="text-xl font-semibold">Time to make your first post!</p>
              <p className="text-sm text-gray-500">Now that you&apos;ve created your community, start things off right by making your first post.</p>
              <Button variant="primary" onClick={createPost}>
                Make your first post
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div className="home-component bg-gray-200/50 dark:bg-[#1a1a1a] opacity-70 h-[6rem] p-2 rounded-l-md space-y-2 flex flex-col" key={i}>
                <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
                <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 mx-auto top-[60px] text-center w-max space-y-2">
            <div className="space-y-1">
              <p className="text-lg font-semibold">There are no posts in this subreddit</p>
              <p className="text-xs font-bold">Be the first to fill this fertile land</p>
            </div>
            <Button variant="primary" onClick={createPost}>
              Add a post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
