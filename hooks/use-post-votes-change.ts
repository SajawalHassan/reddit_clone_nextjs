"use client";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { useEffect } from "react";

interface Props {
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  hasUpvotedPost: boolean;
  hasDownvotedPost: boolean;
  hasChangedVotingStatus: boolean;
}

export const usePostVotesChange = ({ post, hasUpvotedPost, hasDownvotedPost, hasChangedVotingStatus }: Props) => {
  useEffect(() => {
    const upvotedPosts: any[] = JSON.parse(localStorage.getItem("upvotedPosts") || "[]");
    const downvotedPosts: any[] = JSON.parse(localStorage.getItem("downvotedPosts") || "[]");

    if (hasUpvotedPost) {
      const existingUpvoteIndex = upvotedPosts.findIndex((upvotedPost) => upvotedPost.id === post.id);
      const existingDownvoteIndex = downvotedPosts.findIndex((downvotedPost) => downvotedPost.id === post.id);

      // If downvote exists
      if (existingDownvoteIndex !== -1) {
        downvotedPosts.splice(existingDownvoteIndex, 1); // remove the downvote
      }

      // Upvote doesn't exist
      if (existingUpvoteIndex === -1) {
        upvotedPosts.unshift(post); // Add it as first item
      }

      localStorage.setItem("upvotedPosts", JSON.stringify(upvotedPosts));
      localStorage.setItem("downvotedPosts", JSON.stringify(downvotedPosts));
    }

    if (hasDownvotedPost) {
      const existingDownvoteIndex = downvotedPosts.findIndex((downvotedPost) => downvotedPost.id === post.id);
      const existingUpvoteIndex = upvotedPosts.findIndex((upvotedPost) => upvotedPost.id === post.id);

      // If upvote exists
      if (existingUpvoteIndex !== -1) {
        upvotedPosts.splice(existingUpvoteIndex, 1); // remove the upvote
      }

      // Downvote doesn't exist
      if (existingDownvoteIndex === -1) {
        downvotedPosts.unshift(post); // Add it as first item
      }

      localStorage.setItem("downvotedPosts", JSON.stringify(downvotedPosts));
      localStorage.setItem("upvotedPosts", JSON.stringify(upvotedPosts));
    }

    if (!hasDownvotedPost && !hasUpvotedPost) {
      const existingDownvoteIndex = downvotedPosts.findIndex((downvotedPost) => downvotedPost.id === post.id);
      const existingUpvoteIndex = upvotedPosts.findIndex((upvotedPost) => upvotedPost.id === post.id);

      // If upvote exists
      if (existingUpvoteIndex !== -1) {
        upvotedPosts.splice(existingUpvoteIndex, 1); // remove the upvote
      }

      // If downvote exists
      if (existingDownvoteIndex !== -1) {
        downvotedPosts.splice(existingDownvoteIndex, 1); // remove the downvote
      }

      localStorage.setItem("downvotedPosts", JSON.stringify(downvotedPosts));
      localStorage.setItem("upvotedPosts", JSON.stringify(upvotedPosts));
    }
  }, [hasChangedVotingStatus]);
};
