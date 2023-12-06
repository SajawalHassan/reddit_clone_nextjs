"use client";

import { PostWithCommentsWithCommunity } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";

export default function PostIdPage() {
  const [post, setPost] = useState<PostWithCommentsWithCommunity>();

  const params = useParams();

  useEffect(() => {
    const getPost = async (postId: string) => {
      const url = qs.stringifyUrl({ url: "/api/posts/specific", query: { postId } });
      const response = await axios.get(url);

      const post = response.data;
      if (!post) return;
      setPost(post);
    };

    getPost(params?.postId as string);
  }, []);

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

  return (
    <div>
      <p>Post page</p>
    </div>
  );
}
