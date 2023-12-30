"use client";

import axios from "axios";
import qs from "query-string";

import { PostWithCommentsWithCommunity } from "@/types";
import { useEffect, useState } from "react";
import { useGlobalInfo } from "@/hooks/use-global-info";

export const PostClient = ({ postId }: { postId: string }) => {
  const [post, setPost] = useState<PostWithCommentsWithCommunity>();

  const { setHeaderActivePlace } = useGlobalInfo();

  useEffect(() => {
    if (!post) return;

    const visitedPosts: any[] = JSON.parse(localStorage.getItem("visitedPosts") || "[]");

    const existingIndex = visitedPosts.indexOf(post.id);

    if (existingIndex !== -1) {
      visitedPosts.splice(existingIndex, 1); // Remove the element
      visitedPosts.unshift(post.id); // Add it as the first element of the list
    } else {
      visitedPosts.unshift(post.id);
    }

    localStorage.setItem("visitedPosts", JSON.stringify(visitedPosts));
  }, [post]);

  useEffect(() => {
    const getPost = async (postId: string) => {
      const url = qs.stringifyUrl({ url: "/api/posts/specific", query: { postId } });
      const response = await axios.get(url);

      const post = response.data;
      if (!post) return;
      setPost(post);
    };

    getPost(postId);
  }, []);

  useEffect(() => {
    if (post) {
      setHeaderActivePlace({ text: post.community.uniqueName, imageUrl: post.community.imageUrl });
      document.title = `${post.title} : ${post.community.uniqueName}`;
    }
  }, [post]);

  return <div></div>;
};
