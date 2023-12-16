import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { CommentList } from "./comment-list";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, ChevronDown, MessageSquare, ZoomOut } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { PostHomeComponentFooterItem } from "@/components/home-components/post/post-home-component-footer-item";
import { PostCommentInput } from "./post-comment-input";
import axios from "axios";
import { Profile } from "@prisma/client";

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
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);
  const [upvotes, setUpvotes] = useState(comment.upvotes.length - comment.downvotes.length);
  const [activeVote, setActiveVote] = useState<"upvote" | "downvote" | "none">("none");
  const [currentProfile, setCurrentProfile] = useState<Profile>();

  const childComments = getReplies(comment.id);

  const profile = comment.member.profile;

  const hasUpvotedComment = activeVote === "upvote";
  const hasDownvotedComment = activeVote === "downvote";

  useEffect(() => {
    const getProfile = async () => {
      const response = await axios.get("/api/profile");
      setCurrentProfile(response.data);
    };
    getProfile();
  }, []);

  useEffect(() => {
    if (!currentProfile) return;
    const hasUpvoted = comment.upvotes.some((upvote) => upvote.profileId === currentProfile.id);
    const hasDownvoted = comment.downvotes.some((downvote) => downvote.profileId === currentProfile.id);

    if (hasUpvoted) setActiveVote("upvote");
    else if (hasDownvoted) setActiveVote("downvote");
  }, [currentProfile]);

  const votePost = async (type: "upvote" | "downvote") => {
    try {
      if (type === "upvote") setIsUpvoting(true);
      else setIsDownvoting(true);

      const res = await axios.patch("/api/posts/comments/vote", { type, commentId: comment.id });
      const voteInfo = res.data;

      if (voteInfo["voteType"] === "upvote") {
        setUpvotes(upvotes + voteInfo["amount"]);
        setActiveVote(voteInfo["activeVote"]);
      }

      if (voteInfo["voteType"] === "downvote") {
        setUpvotes(upvotes - voteInfo["amount"]);
        setActiveVote(voteInfo["activeVote"]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (type === "upvote") setIsUpvoting(false);
      else setIsDownvoting(false);
    }
  };

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
                  "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black",
                  hasUpvotedComment && "text-orange-500 font-bold hover:text-orange-700",
                  isUpvoting && "bg-gray-200 rounded-sm cursor-default"
                )}
                onClick={() => {
                  if (!isUpvoting) votePost("upvote");
                }}
              />
              <p className="text-sm font-bold">{upvotes}</p>
              <ArrowDownCircle
                className={cn(
                  "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black",
                  hasDownvotedComment && "text-orange-500 font-bold hover:text-orange-700",
                  isDownvoting && "bg-gray-200 rounded-sm cursor-default"
                )}
                onClick={() => {
                  if (!isDownvoting) votePost("downvote");
                }}
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
