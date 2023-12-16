"use client";
import { usePostVisitation } from "@/hooks/use-post-visitation";
import { PostWithCommentsWithCommunity } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import qs from "query-string";
import { useGlobalInfo } from "@/hooks/use-global-info";

export const PostClient = ({ postId }: { postId: string }) => {
  const [post, setPost] = useState<PostWithCommentsWithCommunity>();

  const { setHeaderActivePlace } = useGlobalInfo();

  usePostVisitation({ post, setPost });

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
