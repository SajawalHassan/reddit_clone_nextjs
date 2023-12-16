import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { CommentList } from "./comment-list";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDown, ArrowDownCircle, ArrowUpCircle, ChevronDown, MessageSquare, ZoomOut } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { MouseEvent, useState } from "react";
import { PostHomeComponentFooterItem } from "@/components/home-components/post/post-home-component-footer-item";
import { PostCommentInput } from "./post-comment-input";

const DATE_FORMAT = "d MMM";

export const Comment = ({
  comment,
  getReplies,
  setComments,
}: {
  comment: CommentWithMemberWithProfileWithVotesWithPost;
  getReplies: (parentId: string) => any;
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [childrenAreHidden, setChildrenAreHidden] = useState(false);

  const childComments = getReplies(comment.id);

  const profile = comment.member.profile;
  const hasUpvotedPost = true;
  const hasDownvotedPost = false;

  const votePost = async (e: MouseEvent, type: "upvote" | "downvote") => {};

  return (
    <>
      <div className="flex gap-x-1">
        <div className="flex gap-x-2">
          {childrenAreHidden && (
            <ChevronDown className="h-8 w-8 cursor-pointer text-gray-500 hover:text-black" onClick={() => setChildrenAreHidden(false)} />
          )}
          <img src={profile.imageUrl} alt={profile.displayName} className="h-8 w-8 rounded-full" />
        </div>
        <div className="w-full">
          <p className="text-sm font-semibold">
            {profile.displayName} · <span className="font-normal text-gray-500 text-[11px]">{format(new Date(comment.createdAt), DATE_FORMAT)}</span>
          </p>
          <p className="text-[14px] leading-[21px]">{comment.content}</p>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1.5">
              <ArrowUpCircle
                className={cn(
                  "h-5 w-5 text-gray-500 hover:text-black cursor-pointer",
                  hasUpvotedPost && "text-orange-500 font-bold hover:text-orange-700"
                )}
              />
              <p className="text-sm font-bold">{comment.upvotes.length}</p>
              <ArrowDownCircle
                className={cn("h-5 w-5 text-gray-500 hover:text-black cursor-pointer", hasDownvotedPost && "text-orange-500 font-bold")}
              />
            </div>

            <PostHomeComponentFooterItem
              Icon={MessageSquare}
              className="py-0.5 px-1 rounded-sm"
              IconClassName="h-5 w-5"
              textClassName="text-[12px]"
              text="Reply"
              onClick={() => setIsReplying(true)}
            />
          </div>
          {isReplying && (
            <PostCommentInput
              setComments={setComments}
              post={comment.post}
              type="reply"
              parentCommentId={comment.id}
              className="mt-1.5"
              closeInput={() => setIsReplying(false)}
            />
          )}
        </div>
      </div>
      {childComments?.length > 0 && (
        <>
          <div className={cn("flex", childrenAreHidden && "hidden")}>
            <button className="bg-none border-l-2 px-0.5 hover:border-black outline-none" onClick={() => setChildrenAreHidden(true)} />
            <div className="pl-[1rem] flex-grow space-y-2">
              <CommentList comments={childComments} getReplies={getReplies} setComments={setComments} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
