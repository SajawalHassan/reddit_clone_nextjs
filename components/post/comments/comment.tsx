import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { CommentList } from "./comment-list";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, ChevronDown, MessageSquare, MoreVertical, Pencil, Trash, ZoomOut } from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { PostFooterItem } from "@/components/post/post-footer-item";
import { PostCommentInput } from "./post-comment-input";
import axios from "axios";
import { Profile } from "@prisma/client";
import { PostFooterItemMenuItem } from "@/components/post/post-footer-item-menu-item";
import qs from "query-string";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { useCommunityInfo } from "@/hooks/use-community-info";
import { useRouter } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

const DATE_FORMAT = "d MMM";

interface Props {
  comment: CommentWithMemberWithProfileWithVotesWithPost;
  getReplies: (parentId: string) => any;
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
  showReplies?: boolean;
}

export const Comment = ({ comment, getReplies, setComments, showReplies = true }: Props) => {
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
  const [editedContent, setEditedContent] = useState<string>(comment.content);
  const [content, setContent] = useState<string>(comment.content);
  const [image, setImage] = useState<string>(comment.imageUrl || "");

  const { profile: currentProfile, setProfile: setCurrentProfile, viewingProfile } = useGlobalInfo();
  const { currentMember } = useCommunityInfo();

  const router = useRouter();
  const childComments = getReplies(comment.id);
  const commentProfile = comment.member.profile;
  const queryClient = useQueryClient();

  const hasUpvotedComment = activeVote === "upvote";
  const hasDownvotedComment = activeVote === "downvote";
  const isOwner = currentProfile?.id === commentProfile?.id;

  useEffect(() => {
    const getProfile = async () => {
      if (currentProfile !== null) return;

      try {
        const response = await axios.get("/api/profile");
        setCurrentProfile(response.data);
      } catch (error: any) {
        if (error.response.status === 401) redirectToSignIn();
        else console.log(error);
      }
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

  const handleEditSubmit = async (e: FormEvent, newComment: string, newImage: string) => {
    e.preventDefault();

    if (newComment === comment.content) return;
    if (newComment === "" && newImage === "") return;

    try {
      setIsSubmittingEdit(true);
      setContent(newComment);
      setImage(newImage);

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
    <div
      className="flex"
      onClick={() => {
        if (!showReplies) {
          router.push(`/main/communities/${comment.post.communityId}/post/${comment.postId}`);
        }
      }}>
      {childComments?.length > 0 && !childrenAreHidden && showReplies && (
        <button className="bg-none border-l-2 px-0.5 mr-2 hover:border-black outline-none" onClick={() => setChildrenAreHidden(true)} />
      )}
      <div className={cn("w-full", showReplies && "mt-2")} id={comment.id}>
        <div
          className={cn(
            "flex gap-x-1",
            isDeletingComment && "cursor-not-allowed",
            !showReplies && "border-2 border-transparent hover:border-black dark:hover:border-[#3c3c3d] px-6 rounded-sm py-2 cursor-pointer"
          )}>
          {childrenAreHidden && (
            <ChevronDown className="h-8 w-8 cursor-pointer text-gray-500 hover:text-black" onClick={() => setChildrenAreHidden(false)} />
          )}
          <img src={commentProfile.imageUrl} alt={commentProfile.displayName} className={cn("h-[32px] w-[32px] rounded-full")} />
          <div className="w-full">
            <p className={cn("text-sm font-semibold", isDeletingComment && "text-gray-500")}>
              <Link
                href={`/main/users/${commentProfile.id}?overview=true`}
                className="hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  queryClient.setQueryData([`feed:user:${viewingProfile?.id}:overview`], []);
                }}>
                {commentProfile.displayName}
              </Link>{" "}
              · {hasEditedComment && <span className="text-xs text-gray-500 italic font-normal">edited</span>}{" "}
              <span className="font-normal text-gray-500 text-[11px]">{format(new Date(comment.createdAt), DATE_FORMAT)}</span>
            </p>
            {isEditing ? (
              <PostCommentInput
                memberId={currentMember?.id}
                setComments={setComments}
                post={comment.post}
                type="custom"
                closeInput={() => setIsEditing(false)}
                prePropulatedContent={editedContent}
                prePropulatedImageUrl={image}
                disabled={isSubmittingEdit}
                onSubmit={handleEditSubmit}
                setEditedComment={setEditedContent}
              />
            ) : content ? (
              <p className={cn("text-[14px] leading-[21px] whitespace-pre-wrap", isDeletingComment && "text-gray-500")}>{content}</p>
            ) : (
              <img src={image} className="py-2" />
            )}
            {!isEditing && (
              <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-1.5">
                  <ArrowUpCircle
                    className={cn(
                      "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black dark:hover:text-gray-200",
                      hasUpvotedComment && "text-orange-500 font-bold hover:text-orange-700 dark:hover:text-orange-300",
                      isUpvoting && "bg-gray-200 rounded-sm cursor-not-allowed dark:bg-stone-600",
                      isDeletingComment && "cursor-not-allowed"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isUpvoting && !isDeletingComment) votePost("upvote");
                    }}
                  />
                  <p className="text-sm font-bold">{upvotes}</p>
                  <ArrowDownCircle
                    className={cn(
                      "h-5 w-5 cursor-pointer p-0.5 text-gray-500 hover:text-black dark:hover:text-gray-200",
                      hasDownvotedComment && "text-orange-500 font-bold hover:text-orange-700 dark:hover:text-orange-300",
                      isDownvoting && "bg-gray-200 rounded-sm cursor-not-allowed dark:bg-stone-600",
                      isDeletingComment && "cursor-not-allowed"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDownvoting && !isDeletingComment) votePost("downvote");
                    }}
                  />
                </div>

                <div className="flex items-center">
                  {showReplies && (
                    <PostFooterItem
                      Icon={MessageSquare}
                      className={cn("py-0.5 px-1 rounded-sm", isDeletingComment && "cursor-not-allowed")}
                      IconClassName="h-5 w-5"
                      textClassName="text-[12px]"
                      text="Reply"
                      onClick={() => setIsReplying(true)}
                      disabled={isDeletingComment}
                    />
                  )}
                  {isOwner && (
                    <div className="relative">
                      <PostFooterItem
                        Icon={MoreVertical}
                        className={cn("py-0.5 px-1 rounded-sm", isDeletingComment && "cursor-not-allowed")}
                        IconClassName="h-4 w-4"
                        textClassName="text-[12px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreMenuIsOpen(true);
                        }}
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
                        <div className="absolute shadow-lg dark:shadow-black py-2 top-8 w-[10rem] bg-white dark:bg-[#1A1A1B] dark:text-white border-zinc-200 dark:border-zinc-800 z-30">
                          {showReplies && (
                            <PostFooterItemMenuItem
                              Icon={Pencil}
                              text="Edit comment"
                              onClick={() => {
                                setMoreMenuIsOpen(false);
                                setIsEditing(true);
                              }}
                            />
                          )}
                          <PostFooterItemMenuItem
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
                memberId={currentMember?.id}
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
        {childComments?.length > 0 && showReplies && (
          <div>
            <div className={cn("flex", childrenAreHidden && "hidden")}>
              <div className="pl-[1.5rem] flex-grow space-y-2">
                <CommentList comments={childComments} getReplies={getReplies} setComments={setComments} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
