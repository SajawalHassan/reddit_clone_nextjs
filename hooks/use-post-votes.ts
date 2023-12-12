"use client";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";

interface Props {
  profile: Profile | undefined;
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  setUpvotes: React.Dispatch<React.SetStateAction<number>>;
  upvotes: number;
  formatter: Intl.NumberFormat;
  setFormattedUpvotes: React.Dispatch<React.SetStateAction<string>>;
}

export const usePostVotes = ({ profile, post, setUpvotes, upvotes, formatter, setFormattedUpvotes }: Props) => {
  useEffect(() => {
    const checkAndSetUpvotes = async () => {
      if (!profile) return;

      const upvotedPosts: any[] = JSON.parse(localStorage.getItem("upvotedPosts") || "[]");
      const downvotedPosts: any[] = JSON.parse(localStorage.getItem("downvotedPosts") || "[]");

      const hasLocallyUpvotedPost = upvotedPosts.some((upvotedPost) => upvotedPost.id === post.id);
      const hasActuallyUpvotedPost = post.upvotes.some((upvote: PostProfileUpvotes) => upvote.profileId === profile.id);

      const hasLocallyDownvotedPost = downvotedPosts.some((downvotedPost) => downvotedPost.id === post.id);
      const hasActuallyDownvotedPost = post.downvotes.some((downvote: PostProfileDownvotes) => downvote.profileId === profile.id);

      if (hasLocallyUpvotedPost && !hasActuallyUpvotedPost) {
        await axios.patch("/api/posts/vote", { type: "upvote", postId: post.id });
        setUpvotes(upvotes + 1);
      }

      if (hasLocallyDownvotedPost && !hasActuallyDownvotedPost) {
        await axios.patch("/api/posts/vote", { type: "downvote", postId: post.id });
        setUpvotes(upvotes - 1);
      }
    };

    checkAndSetUpvotes();
  }, [profile]);

  useEffect(() => {
    setFormattedUpvotes(formatter.format(upvotes));
  }, [upvotes, formatter]);
};
