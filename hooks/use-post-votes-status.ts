"use client";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";

interface Props {
  profile: Profile | undefined;
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  setUpvotes: React.Dispatch<React.SetStateAction<number>>;
  setHasUpvotedPost: React.Dispatch<React.SetStateAction<boolean>>;
  setHasDownvotedPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePostVotesStatus = ({ profile, post, setUpvotes, setHasDownvotedPost, setHasUpvotedPost }: Props) => {
  useEffect(() => {
    const setVotingStatus = async () => {
      if (!profile) return;
      setHasUpvotedPost(post.upvotes.some((upvote: PostProfileUpvotes) => upvote.profileId === profile.id));
      setHasDownvotedPost(post.downvotes.some((downvote: PostProfileDownvotes) => downvote.profileId === profile.id));
    };

    setUpvotes(post.upvotes.length - post.downvotes.length);
    setVotingStatus();
  }, [post, profile]);
};
