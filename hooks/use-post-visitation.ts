"use client";

import { PostWithCommentsWithCommunity } from "@/types";
import { useEffect } from "react";

interface Props {
  post: PostWithCommentsWithCommunity | undefined;
  setPost: React.Dispatch<React.SetStateAction<PostWithCommentsWithCommunity | undefined>>;
}

export const usePostVisitation = ({ post, setPost }: Props) => {
  useEffect(() => {
    if (!post) return;

    const visitedPosts: any[] = JSON.parse(localStorage.getItem("visitedPosts") || "[]");

    const existingIndex = visitedPosts.findIndex((visitedPost) => visitedPost.id === post.id);

    if (existingIndex !== -1) {
      visitedPosts.splice(existingIndex, 1); // Remove the element
      visitedPosts.unshift(post); // Add it as the first element of the list
    } else {
      visitedPosts.unshift(post);
    }

    localStorage.setItem("visitedPosts", JSON.stringify(visitedPosts));
  }, [post]);
};
