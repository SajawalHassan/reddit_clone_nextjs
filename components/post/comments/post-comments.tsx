"use client";

import { useEffect, useMemo, useState } from "react";
import { PostCommentInput } from "./post-comment-input";
import { CommentWithMemberWithProfileWithVotesWithPost, PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import axios from "axios";
import qs from "query-string";
import { CommentList } from "./comment-list";

export const PostComments = ({ post }: { post: PostWithMemberWithProfileWithCommunityWithVotes }) => {
  const [comments, setComments] = useState<CommentWithMemberWithProfileWithVotesWithPost[]>([]);

  const commentsByParentId = useMemo(() => {
    const group: any = {};
    comments.forEach((comment) => {
      group[comment.parentId as any] ||= [];
      group[comment.parentId as any].push({ ...comment, post: post });
    });

    return group;
  }, [comments]);

  const rootComments = commentsByParentId[null!];

  useEffect(() => {
    const getComments = async () => {
      const url = qs.stringifyUrl({ url: "/api/posts/comments", query: { postId: post.id } });
      const res = await axios.get(url);
      setComments(res.data);
    };

    getComments();
  }, []);

  const getReplies = (parentId: string) => commentsByParentId[parentId];

  return (
    <div className="px-2">
      <div className="bg-white py-4 px-[3.5rem]">
        <div>
          <p className="mt-2 text-xs mb-2">Comment as {post?.member.profile.displayName}</p>
          <PostCommentInput setComments={setComments} post={post} type="comment" />
        </div>
        <div>
          {rootComments != null && rootComments.length > 0 && (
            <div className="mt-4 space-y-3">
              <CommentList comments={rootComments} setComments={setComments} getReplies={getReplies} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
