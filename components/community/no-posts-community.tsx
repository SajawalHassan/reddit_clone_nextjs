"use client";

import { ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { IconButton } from "../icon-button";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Member, MemberRole } from "@prisma/client";
import axios from "axios";
import qs from "query-string";

export const NoPostsCommunity = ({ communityId }: { communityId: string }) => {
  const [currentMember, setCurrentMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;
  const hasPrivilages = isAdmin || isModerator;

  useEffect(() => {
    const setMember = async () => {
      setIsLoading(true);
      const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

      const response = await axios.get(url);
      setCurrentMember(response.data.currentMember[0]);
      setIsLoading(false);
    };
    setMember();
  }, []);

  if (isLoading) return;

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
              onClick={() => router.push(`/main/create/post?plain=true&preselected=${communityId}`)}
            />
            <div className="space-y-2">
              <p className="text-xl font-semibold">Time to make your first post!</p>
              <p className="text-sm text-gray-500">Now that you've created your community, start things off right by making your first post.</p>
              <Button variant="primary" onClick={() => router.push(`/main/create/post?plain=true&preselected=${communityId}`)}>
                Make your first post
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div className="home-component bg-gray-200/50 h-[6rem] p-2 rounded-l-md space-y-2">
                <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
                <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max hover:bg-transparent cursor-default" IconClassName="text-gray-400" />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 mx-auto top-[84px] text-center w-max space-y-1">
            <div className="space-y-1">
              <p className="text-lg font-semibold">There are no posts in this subreddit</p>
              <p className="text-xs font-bold">Be the first to fill this fertile land</p>
            </div>
            <Button variant="primary" onClick={() => router.push(`/main/create/post?plain=true&preselected=${communityId}`)}>
              Add a post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
