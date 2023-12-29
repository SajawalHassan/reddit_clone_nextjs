"use client";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { ArrowDownCircle, ArrowUpCircle, Link, Loader2, MessageSquare, MoreHorizontal, MoreVertical, Pencil, Share, Trash } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { PostFooterItem } from "@/components/post/post-footer-item";
import { PostFooterItemMenuItem } from "../../post/post-footer-item-menu-item";

import axios from "axios";
import dynamic from "next/dynamic";
import { useGlobalInfo } from "@/hooks/use-global-info";
import qs from "query-string";
import { redirectToSignIn } from "@clerk/nextjs";

const FroalaEditorView = dynamic(
  async () => {
    const values = await Promise.all([import("react-froala-wysiwyg/FroalaEditorView")]);
    return values[0];
  },
  {
    loading: () => (
      <div className="flex items-center justify-center w-full mt-5">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

const DATE_FORMAT = "d MMM yyyy, HH:mm";
const SHORT_DATE_FORMAT = "d MMM yyyy";

interface Props {
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  isOnPostPage?: boolean;
  className?: string;
  votesClassName?: string;
}

export const PostHomeComponent = ({ post, isOnPostPage = false, className, votesClassName }: Props) => {
  const { setHeaderActivePlace } = useGlobalInfo();

  const [upvotes, setUpvotes] = useState(post.upvotes.length - post.downvotes.length);
  const [activeVote, setActiveVote] = useState<"upvote" | "downvote" | "none">("none");
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [moreMenuIsOpen, setMoreMenuIsOpen] = useState(false);
  const [hasViewedPost, setHasViewedPost] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const { profile: currentProfile, setProfile: setCurrentProfile } = useGlobalInfo();

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const router = useRouter();

  const isOnlyTitle = !post.content && !post.imageUrl && !post.link;
  const hasUpvotedPost = activeVote === "upvote";
  const hasDownvotedPost = activeVote === "downvote";
  const isOwner = post.member.profile.id === currentProfile?.id;

  useEffect(() => {
    const visitedPosts: any[] = JSON.parse(localStorage.getItem("visitedPosts") || "[]");

    const existingIndex = visitedPosts.findIndex((visitedPost) => visitedPost.id === post.id);

    if (existingIndex === -1) setHasViewedPost(false);
    else setHasViewedPost(true);
  }, []);

  useEffect(() => {
    router.prefetch(`/main/communities/${post.communityId}/post/${post.id}`);
  }, []);

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
    if (!currentProfile) return;
    const hasUpvoted = post.upvotes.some((upvote) => upvote.profileId === currentProfile.id);
    const hasDownvoted = post.downvotes.some((downvote) => downvote.profileId === currentProfile.id);

    if (hasUpvoted) setActiveVote("upvote");
    else if (hasDownvoted) setActiveVote("downvote");
  }, [currentProfile]);

  const votePost = async (e: MouseEvent, type: "upvote" | "downvote") => {
    e.stopPropagation();
    if (isUpvoting || isDownvoting) return;

    const wantsToUpvote = type === "upvote";

    if (wantsToUpvote) setIsUpvoting(true);
    else setIsDownvoting(true);

    try {
      const res = await axios.patch("/api/posts/vote", { type, postId: post.id });
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
      if (wantsToUpvote) setIsUpvoting(false);
      else setIsDownvoting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeletingPost(true);

      const url = qs.stringifyUrl({ url: "/api/posts", query: { communityId: post.communityId, postId: post.id } });
      await axios.delete(url);

      router.push(`/main/communities/${post.communityId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeletingPost(false);
    }
  };

  const copyPostLink = (e: MouseEvent) => {
    e.stopPropagation();
    if (process.env.NODE_ENV === "development") {
      navigator.clipboard.writeText(`https://localhost:3000/main/communities/${post.communityId}/post/${post.id}`);
    } else {
      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL!}/main/communities/${post.communityId}/post/${post.id}`);
    }
    setMenuIsOpen(false);
  };

  const pushToUrl = (e: MouseEvent, url: string, type: "community" | "user") => {
    e.stopPropagation();
    if (type === "community") {
      setHeaderActivePlace({ text: post.community.uniqueName, imageUrl: post.community.imageUrl });
    } else {
      setHeaderActivePlace({ text: post.member.profile.displayName, imageUrl: post.member.profile.imageUrl });
    }
    router.push(url);
  };

  return (
    <div className={cn("px-2", isOnPostPage ? "w-full dark:bg-[#1a1a1a]" : "home-component-container")}>
      {isDeletingPost && <div className="absolute inset-0 m-auto bg-black opacity-10 mx-2" />}
      <div
        className={cn(
          "flex p-0 hover:border-black hover:dark:border-[#818384] cursor-pointer",
          menuIsOpen && "border-transparent hover:border-transparent dark:border-transparent dark:hover:border-transparent",
          isOnPostPage ? "bg-white dark:bg-[#1a1a1a] cursor-default" : "home-component",
          className
        )}
        onClick={(e: MouseEvent) => {
          if (!isOnPostPage) pushToUrl(e, `/main/communities/${post.communityId}/post/${post.id}`, "community");
        }}>
        <div
          className={cn(
            "w-[2.5rem] xs:w-[4rem] p-1 xs:p-2 flex flex-col items-center rounded-l-md",
            !isOnPostPage && "bg-gray-100 dark:bg-[#151516]",
            votesClassName
          )}>
          <IconButton
            Icon={ArrowUpCircle}
            className={cn(
              "rounded-sm w-max text-zinc-600",
              hasUpvotedPost && "text-orange-500 font-bold",
              isUpvoting && "bg-gray-200 dark:bg-stone-800 cursor-not-allowed"
            )}
            onClick={(e: MouseEvent) => votePost(e, "upvote")}
          />
          <p className="text-sm font-bold">{formatter.format(upvotes)}</p>
          <IconButton
            Icon={ArrowDownCircle}
            className={cn(
              "rounded-sm w-max text-zinc-600",
              hasDownvotedPost && "text-orange-500 font-bold",
              isDownvoting && "bg-gray-200 dark:bg-stone-800 cursor-not-allowed"
            )}
            onClick={(e: MouseEvent) => votePost(e, "downvote")}
          />
        </div>

        <div className="w-full pt-2 px-2">
          <div className="overflow-hidden">
            <div className="flex items-center gap-x-1 text-[10px] sm:text-xs">
              <img
                src={post.community.imageUrl}
                alt={post.community.name}
                className="h-6 w-6 rounded-full cursor-pointer hover:ring-2 ring-gray-200 dark:ring-zinc-700"
                onClick={(e: MouseEvent) => pushToUrl(e, `/main/communities/${post.communityId}`, "community")}
              />
              <p
                className="font-bold cursor-pointer hover:underline"
                onClick={(e: MouseEvent) => pushToUrl(e, `/main/communities/${post.communityId}`, "community")}>
                r/{post.community.uniqueName}
              </p>{" "}
              ·{" "}
              <p className="text-gray-500 flex gap-x-1">
                <span className="hidden xs:block">Posted by</span>{" "}
                <span
                  className="hover:underline cursor-pointer"
                  onClick={(e: MouseEvent) => pushToUrl(e, `/main/users/${post.member.profileId}?overview=true`, "user")}>
                  u/{post.member.profile.displayName}
                </span>{" "}
                on
                <span className="hidden xs:block">{format(new Date(post.createdAt), DATE_FORMAT)}</span>
                <span className="xs:hidden">{format(new Date(post.createdAt), SHORT_DATE_FORMAT)}</span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <h3 className={cn("text-lg font-semibold", isOnlyTitle && "text-xl mt-1.5", hasViewedPost && "text-gray-500")}>{post.title}</h3>
                {post.spoiler && <p className="font-bold text-[11px] uppercase bg-gray-200 rounded-md text-zinc-700 px-1 py-0.5">Spoiler</p>}
              </div>
              <div>
                {post.content && (
                  <div className={hasViewedPost ? "text-gray-500" : ""}>
                    {post.spoiler ? (
                      <div className="flex items-center justify-center">
                        <p className="w-full max-w-[15rem] py-1.5 font-bold mt-2 text-center text-gray-600 hover:bg-opacity-80 bg-gray-200 dark:text-gray-800 bg-opacity-60 rounded-md uppercase">
                          Click to see spoiler
                        </p>
                      </div>
                    ) : (
                      <FroalaEditorView model={post.content} />
                    )}
                  </div>
                )}
                {post.imageUrl && (
                  <div className="relative overflow-hidden flex justify-center w-full">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className={cn(
                        "max-h-[512px] mt-1",
                        post.spoiler && !isOnPostPage && "blur-[20px] brightness-75",
                        isOnPostPage && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (isOnPostPage) window.open(post.imageUrl as string, "_blank");
                      }}
                    />
                    {post.spoiler && !isOnPostPage && (
                      <p className="w-full max-w-[15rem] py-1.5 font-bold text-center text-gray-600 hover:bg-opacity-80 bg-gray-100 bg-opacity-60 rounded-md uppercase absolute bottom-5 inset-x-0 mx-auto cursor-pointer">
                        Click to see spoiler
                      </p>
                    )}
                  </div>
                )}
                {post.link && (
                  <a href={post.link} target="_blank" className="text-blue-500 hover:underline cursor-pointer">
                    {post.link}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-2 mb-1">
            {isOnPostPage ? (
              <div className="flex items-center gap-x-2 py-1.5 px-1.5 dark:text-white">
                <MessageSquare className="font-light h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 cursor-text">{post.comments.length} comments</p>
              </div>
            ) : (
              <PostFooterItem Icon={MessageSquare} text={`${post.comments.length} comments`} />
            )}
            <div className="relative">
              <PostFooterItem
                Icon={Share}
                text="Share"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  setMenuIsOpen(true);
                }}
              />

              {menuIsOpen && (
                <div
                  className="z-20 fixed inset-0 h-full w-full cursor-default"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    setMenuIsOpen(false);
                  }}
                />
              )}
              {menuIsOpen && (
                <div className="absolute top-8 w-[10rem] bg-white dark:bg-[#1A1A1B] dark:text-white border-zinc-200 dark:border-zinc-800 z-30 shadow-lg dark:shadow-black">
                  <PostFooterItemMenuItem Icon={Link} text="Copy Link" onClick={(e: MouseEvent) => copyPostLink(e)} />
                </div>
              )}
            </div>
            {isOwner && isOnPostPage && (
              <div className="relative">
                <PostFooterItem
                  Icon={MoreHorizontal}
                  IconClassName="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreMenuIsOpen(true);
                  }}
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
                    <PostFooterItemMenuItem
                      Icon={Trash}
                      text="Delete post"
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
      </div>
    </div>
  );
};

// comp 1 (number) > comp 2 > comp 3 > comp 4
// number
