"use client";

import { useSearchParams } from "next/navigation";
import { UserOverviewFeed } from "./user-overview-feed";
import { UserPostsFeed } from "./user-posts-feed";
import { UserCommentsFeed } from "./user-comments-feed";
import { UserUpvotedPostsFeed } from "./user-upvoted-posts-feed";
import { UserDownvotedPostsFeed } from "./user-downvoted-posts-feed";

export const UserFeedsController = ({ profileId }: { profileId: string }) => {
  const searchParams = useSearchParams();
  const isOverview = searchParams?.get("overview") ? true : false;
  const isPosts = searchParams?.get("posts") ? true : false;
  const isComments = searchParams?.get("comments") ? true : false;
  const isUpvoted = searchParams?.get("upvoted") ? true : false;
  const isDownvoted = searchParams?.get("downvoted") ? true : false;

  return (
    <>
      {isOverview && <UserOverviewFeed profileId={profileId} />}
      {isPosts && <UserPostsFeed profileId={profileId} />}
      {isComments && <UserCommentsFeed profileId={profileId} />}
      {isUpvoted && <UserUpvotedPostsFeed profileId={profileId} />}
      {isDownvoted && <UserDownvotedPostsFeed profileId={profileId} />}
    </>
  );
};
