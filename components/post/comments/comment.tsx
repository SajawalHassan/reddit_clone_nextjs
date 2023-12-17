import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { CommentList } from "./comment-list";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, ChevronDown, MessageSquare, MoreVertical, Pencil, Trash, ZoomOut } from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { PostHomeComponentFooterItem } from "@/components/home-components/post/post-home-component-footer-item";
import { PostCommentInput } from "./post-comment-input";
import axios from "axios";
import { Profile } from "@prisma/client";
import { PostHomeComponentFooterItemMenuItem } from "@/components/home-components/post/post-home-component-footer-item-menu-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import qs from "query-string";

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
  const [moreMenuIsOpen, setMoreMenuIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [hasEditedComment, setHasEditedComment] = useState(false);
  const [upvotes, setUpvotes] = useState(comment.upvotes.length - comment.downvotes.length);
  const [activeVote, setActiveVote] = useState<"upvote" | "downvote" | "none">("none");
  const [currentProfile, setCurrentProfile] = useState<Profile>();
  const [editedContent, setEditedContent] = useState(comment.content);
  const [content, setContent] = useState(comment.content);

  const childComments = getReplies(comment.id);

  const commentProfile = comment.member.profile;

  const hasUpvotedComment = activeVote === "upvote";
  const hasDownvotedComment = activeVote === "downvote";
  const isOwner = currentProfile?.id === commentProfile?.id;

  useEffect(() => {
    const getProfile = async () => {
      const response = await axios.get("/api/profile");
      setCurrentProfile(response.data);
    };
    getProfile();
  }, []);

  useEffect(() => {
    setHasEditedComment(comment.createdAt !== comment.updatedAt);
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

  const handleEditSubmit = async (e: FormEvent, newComment: string) => {
    e.preventDefault();

    if (newComment === comment.content) return;
    if (newComment === "") return;

    try {
      setIsSubmittingEdit(true);
      setContent(newComment);

      await axios.patch("/api/posts/comments", { content: newComment, commentId: comment.id });

      setIsEditing(false);
      setHasEditedComment(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeletingComment(true);

      const url = qs.stringifyUrl({ url: "/api/posts/comments", query: { commentId: comment.id, memberId: comment.memberId } });
      await axios.delete(url);

      setComments((comments) => comments.filter((itemComment) => itemComment.id !== comment.id));
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeletingComment(false);
    }
  };

  return (
    <>
      <div className={cn("flex gap-x-1", isDeletingComment && "cursor-not-allowed")}>
        <div className="flex gap-x-2">
          {childrenAreHidden && (
            <ChevronDown className="h-8 w-8 cursor-pointer text-gray-500 hover:text-black" onClick={() => setChildrenAreHidden(false)} />
          )}
          <img src={commentProfile.imageUrl} alt={commentProfile.displayName} className={cn("h-8 w-8 rounded-full")} />
        </div>
        <div className="w-full">
          <p className={cn("text-sm font-semibold", isDeletingComment && "text-gray-500")}>
            {commentProfile.displayName} · {hasEditedComment && <span className="text-xs text-gray-500 italic font-normal">edited</span>}{" "}
            <span className="font-normal text-gray-500 text-[11px]">{format(new Date(comment.createdAt), DATE_FORMAT)}</span>
          </p>
          {isEditing ? (
            <PostCommentInput
              setComments={setComments}
              post={comment.post}
              type="custom"
              closeInput={() => setIsEditing(false)}
              prePropulatedContent={editedContent}
              disabled={isSubmittingEdit}
              onSubmit={handleEditSubmit}
              setEditedComment={setEditedContent}
            />
          ) : (
            <p className={cn("text-[14px] leading-[21px] whitespace-pre-wrap", isDeletingComment && "text-gray-500")}>{content}</p>
          )}
          {!isEditing && (
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-1.5">
                <ArrowUpCircle
                  className={cn(
                    "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black",
                    hasUpvotedComment && "text-orange-500 font-bold hover:text-orange-700",
                    isUpvoting && "bg-gray-200 rounded-sm cursor-default",
                    isDeletingComment && "cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!isUpvoting && !isDeletingComment) votePost("upvote");
                  }}
                />
                <p className="text-sm font-bold">{upvotes}</p>
                <ArrowDownCircle
                  className={cn(
                    "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black",
                    hasDownvotedComment && "text-orange-500 font-bold hover:text-orange-700",
                    isDownvoting && "bg-gray-200 rounded-sm cursor-default",
                    isDeletingComment && "cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!isDownvoting && !isDeletingComment) votePost("downvote");
                  }}
                />
              </div>

              <div className="flex items-center">
                <PostHomeComponentFooterItem
                  Icon={MessageSquare}
                  className={cn("py-0.5 px-1 rounded-sm", isDeletingComment && "cursor-not-allowed")}
                  IconClassName="h-5 w-5"
                  textClassName="text-[12px]"
                  text="Reply"
                  onClick={() => setIsReplying(true)}
                  disabled={isDeletingComment}
                />
                {isOwner && (
                  <div className="relative">
                    <PostHomeComponentFooterItem
                      Icon={MoreVertical}
                      className={cn("py-0.5 px-1 rounded-sm", isDeletingComment && "cursor-not-allowed")}
                      IconClassName="h-4 w-4"
                      textClassName="text-[12px]"
                      onClick={() => setMoreMenuIsOpen(true)}
                      disabled={isDeletingComment}
                    />

                    {moreMenuIsOpen && (
                      <div
                        className="z-20 fixed inset-0 h-full w-full cursor-default"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          setMoreMenuIsOpen(false);
                        }}
                      />
                    )}
                    {moreMenuIsOpen && (
                      <div className="absolute shadow-lg py-2 top-8 w-[10rem] bg-white dark:bg-[#1A1A1B] dark:text-white border-zinc-200 dark:border-zinc-800 z-30">
                        <PostHomeComponentFooterItemMenuItem
                          Icon={Pencil}
                          text="Edit comment"
                          onClick={() => {
                            setMoreMenuIsOpen(false);
                            setIsEditing(true);
                          }}
                        />
                        <PostHomeComponentFooterItemMenuItem
                          Icon={Trash}
                          text="Delete comment"
                          onClick={() => {
                            setMoreMenuIsOpen(false);
                            handleDelete();
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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
