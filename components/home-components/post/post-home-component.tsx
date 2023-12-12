"use client";

import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { ArrowDownCircle, ArrowUpCircle, Link, Loader2, MessageSquare, Share } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { PostHomeComponentFooterItem } from "./post-home-component-footer-item";
import { PostHomeComponentFooterItemMenuItem } from "./post-home-component-footer-item-menu-item";

import axios from "axios";
import dynamic from "next/dynamic";
import { Profile } from "@prisma/client";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { usePostVotes } from "@/hooks/use-post-votes";
import { usePostVotesChange } from "@/hooks/use-post-votes-change";
import { usePostVotesStatus } from "@/hooks/use-post-votes-status";

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

export const PostHomeComponent = ({ post }: { post: PostWithMemberWithProfileWithCommunityWithVotes }) => {
  const { setHeaderActivePlace } = useGlobalInfo();

  const [upvotes, setUpvotes] = useState(0);
  const [formattedUpvotes, setFormattedUpvotes] = useState("");
  const [hasUpvotedPost, setHasUpvotedPost] = useState(false);
  const [hasDownvotedPost, setHasDownvotedPost] = useState(false);
  const [hasChangedVotingStatus, setHasChangedVotingStatus] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [hasViewedPost, setHasViewedPost] = useState(false);
  const [profile, setProfile] = useState<Profile>();

  const isOnlyTitle = !post.content && !post.imageUrl && !post.link;
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const router = useRouter();

  usePostVotes({ profile, post, setUpvotes, upvotes, formatter, setFormattedUpvotes });
  usePostVotesChange({ post, hasUpvotedPost, hasDownvotedPost, hasChangedVotingStatus });
  usePostVotesStatus({ profile, post, setUpvotes, setHasDownvotedPost, setHasUpvotedPost });

  const pushToUrl = (e: MouseEvent, url: string, type: "community" | "user") => {
    e.stopPropagation();
    if (type === "community") {
      setHeaderActivePlace({ text: post.community.uniqueName, imageUrl: post.community.imageUrl });
    } else {
      setHeaderActivePlace({ text: post.member.profile.displayName, imageUrl: post.member.profile.imageUrl });
    }
    router.push(url);
  };

  useEffect(() => {
    const getProfile = async () => {
      const response = await axios.get("/api/profile");
      setProfile(response.data);
    };
    getProfile();
  }, []);

  useEffect(() => {
    const visitedPosts: any[] = JSON.parse(localStorage.getItem("visitedPosts") || "[]");

    const existingIndex = visitedPosts.findIndex((visitedPost) => visitedPost.id === post.id);

    if (existingIndex === -1) setHasViewedPost(false);
    else setHasViewedPost(true);
  }, []);

  const votePost = async (e: MouseEvent, type: "upvote" | "downvote") => {
    e.stopPropagation();

    if (isVoting) {
      return;
    }

    setIsVoting(true);

    const wantsToUpvote = type === "upvote";
    const wantsToDownvote = type === "downvote";

    if (wantsToUpvote) {
      if (hasUpvotedPost) {
        setUpvotes(upvotes - 1);
        setHasUpvotedPost(false);
        setHasDownvotedPost(false);
      } else {
        if (hasDownvotedPost) {
          setUpvotes(upvotes + 2);
          setHasUpvotedPost(true);
          setHasDownvotedPost(false);
        } else {
          setUpvotes(upvotes + 1);
          setHasDownvotedPost(false);
          setHasUpvotedPost(true);
        }
      }
    }

    if (wantsToDownvote) {
      if (hasDownvotedPost) {
        setUpvotes(upvotes + 1);
        setHasUpvotedPost(false);
        setHasDownvotedPost(false);
      } else {
        if (hasUpvotedPost) {
          setUpvotes(upvotes - 2);
          setHasUpvotedPost(false);
          setHasDownvotedPost(true);
        } else {
          setUpvotes(upvotes - 1);
          setHasUpvotedPost(false);
          setHasDownvotedPost(true);
        }
      }
    }

    setHasChangedVotingStatus(!hasChangedVotingStatus);

    try {
      await axios.patch("/api/posts/vote", { type, postId: post.id });
    } catch (error) {
      console.log(error);
    } finally {
      setIsVoting(false);
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

  return (
    <div className="px-2 home-component-container">
      <div
        className={cn(
          "home-component flex p-0 hover:border-black hover:dark:border-[#818384] cursor-pointer",
          menuIsOpen && "border-transparent hover:border-transparent dark:border-transparent dark:hover:border-transparent"
        )}
        onClick={(e: MouseEvent) => pushToUrl(e, `/main/communities/${post.communityId}/post/${post.id}`, "community")}>
        <div className="w-[2.5rem] xs:w-[4rem] bg-gray-100 dark:bg-[#151516] p-1 xs:p-2 flex flex-col items-center rounded-l-md">
          <IconButton
            Icon={ArrowUpCircle}
            className={cn("rounded-sm w-max text-zinc-600", hasUpvotedPost && "text-orange-500 font-bold")}
            onClick={(e: MouseEvent) => votePost(e, "upvote")}
          />
          <p className="text-sm font-bold">{formattedUpvotes}</p>
          <IconButton
            Icon={ArrowDownCircle}
            className={cn("rounded-sm w-max text-zinc-600", hasDownvotedPost && "text-orange-500 font-bold")}
            onClick={(e: MouseEvent) => votePost(e, "downvote")}
          />
        </div>

        <div className="w-full pt-2 px-2">
          <div className="overflow-hidden">
            <div className="flex items-center gap-x-1 text-[10px] sm:text-xs">
              <img
                src={post.community.imageUrl}
                alt={post.community.name}
                className="h-6 w-6 rounded-full cursor-pointer hover:ring-2 ring-gray-200"
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
                  onClick={(e: MouseEvent) => pushToUrl(e, `/main/users/${post.member.profileId}`, "user")}>
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
                    <img src={post.imageUrl} alt={post.title} className={cn("max-h-[512px] mt-1", post.spoiler && "blur-[20px] brightness-75")} />
                    {post.spoiler && (
                      <p className="w-full max-w-[15rem] py-1.5 font-bold text-center text-gray-600 hover:bg-opacity-80 bg-gray-100 bg-opacity-60 rounded-md uppercase absolute bottom-5 inset-x-0 mx-auto">
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
            <PostHomeComponentFooterItem Icon={MessageSquare} text={`${post.comments.length} comments`} />
            <div className="relative">
              <PostHomeComponentFooterItem
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
                <div className="absolute top-8 w-[10rem] bg-white dark:bg-[#1A1A1B] dark:text-white border-zinc-200 dark:border-zinc-800 z-30">
                  <PostHomeComponentFooterItemMenuItem Icon={Link} text="Copy Link" onClick={(e: MouseEvent) => copyPostLink(e)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
