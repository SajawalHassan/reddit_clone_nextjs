import { CommentWithMemberWithProfileWithVotesWithPost, PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { PostHomeComponent } from "./post-home-component";
import { CommentList } from "@/components/post/comments/comment-list";
import { useEffect, useMemo, useState } from "react";
import { useGlobalInfo } from "@/hooks/use-global-info";

interface Props {
  post: PostWithMemberWithProfileWithCommunityWithVotes;
}

export const PostAndCommentsHomeComponent = ({ post }: Props) => {
  const { profile } = useGlobalInfo();

  const [comments, setComments] = useState<CommentWithMemberWithProfileWithVotesWithPost[]>(post.comments);

  useEffect(() => {
    if (profile) setComments(post.comments.filter((comment) => comment.member.profileId === profile.id));
  }, [profile]);

  const commentsByParentId = useMemo(() => {
    const group: any = {};
    comments?.forEach((comment) => {
      group[comment.parentId as any] ||= [];
      group[comment.parentId as any].push({ ...comment, post: post });
    });

    return group;
  }, [comments]);

  const rootComments = commentsByParentId[null!];
  const getReplies = (parentId: string) => commentsByParentId[parentId];

  return (
    <div className="bg-white dark:bg-[#1a1a1a] py-2">
      <PostHomeComponent
        post={post}
        className="rounded-sm border-transparent dark:rounded-sm dark:border-transparent"
        votesClassName="bg-transparent dark:bg-transparent"
      />
      <div className="mx-2">
        <CommentList comments={rootComments} getReplies={getReplies} setComments={setComments} max={3} showReplies={false} />
      </div>
    </div>
  );
};
