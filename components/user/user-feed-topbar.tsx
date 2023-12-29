"use client";

import { useSearchParams } from "next/navigation";
import { UserFeedTopbarItem } from "./user-feed-topbar-item";

export const UserFeedTopbar = ({ profileId }: { profileId: string }) => {
  const searchParams = useSearchParams();
  const isOverview = searchParams?.get("overview") ? true : false;
  const isPosts = searchParams?.get("posts") ? true : false;
  const isComments = searchParams?.get("comments") ? true : false;
  const isUpvoted = searchParams?.get("upvoted") ? true : false;
  const isDownvoted = searchParams?.get("downvoted") ? true : false;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] w-full flex justify-center">
      <div className="w-full flex items-center gap-x-4 px-2 sm:px-10 lg:max-w-[984px] pl-2 sm:pl-10 lg:pl-0 overflow-x-auto">
        <UserFeedTopbarItem content="Overview" link={`/main/users/${profileId}?overview=true`} isActive={isOverview} />
        <UserFeedTopbarItem content="Posts" link={`/main/users/${profileId}?posts=true`} isActive={isPosts} />
        <UserFeedTopbarItem content="Comments" link={`/main/users/${profileId}?comments=true`} isActive={isComments} />
        <UserFeedTopbarItem content="Upvoted" link={`/main/users/${profileId}?upvoted=true`} isActive={isUpvoted} />
        <UserFeedTopbarItem content="Downvoted" link={`/main/users/${profileId}?downvoted=true`} isActive={isDownvoted} />
      </div>
    </div>
  );
};
