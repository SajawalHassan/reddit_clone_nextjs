"use client";

import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { IconButton } from "../icon-button";
import { format } from "date-fns";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
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

export const PostFeedItemHomeComponent = ({ post }: { post: PostWithMemberWithProfileWithCommunity }) => {
  const isOnlyTitle = !post.content && !post.imageUrl && !post.link;

  const router = useRouter();

  const pushToUrl = (e: MouseEvent, url: string) => {
    e.stopPropagation();
    router.push(url);
  };

  return (
    <div className="px-2 w-full max-w-[40rem]">
      <div
        className="home-component flex p-0 hover:border hover:border-black cursor-pointer"
        onClick={() => router.push(`/main/communities/${post.communityId}/post/${post.id}`)}>
        <div className="w-[2.5rem] xs:w-[4rem] bg-gray-100 dark:bg-[#151516] p-1 xs:p-2 flex flex-col items-center rounded-l-md">
          <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max" />
          <p className="text-sm font-bold">{post.upvotes}</p>
          <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max" />
        </div>

        <div className="w-full p-2 overflow-hidden">
          <div className="flex items-center gap-x-1 text-[10px] xs:text-xs">
            <img
              src={post.community.imageUrl}
              alt={post.community.name}
              className="h-6 w-6 rounded-full cursor-pointer hover:ring-2 ring-gray-200"
              onClick={(e: MouseEvent) => pushToUrl(e, `/main/communities/${post.communityId}`)}
            />
            <p
              className="font-bold cursor-pointer hover:underline"
              onClick={(e: MouseEvent) => pushToUrl(e, `/main/communities/${post.communityId}`)}>
              r/{post.community.uniqueName}
            </p>{" "}
            ·{" "}
            <p className="text-gray-500 flex gap-x-1">
              <span className="hidden xs:block">Posted by</span>{" "}
              <span className="hover:underline cursor-pointer" onClick={(e: MouseEvent) => pushToUrl(e, `/main/users/${post.member.profileId}`)}>
                u/{post.member.profile.displayName}
              </span>{" "}
              on
              <span className="hidden xs:block">{format(new Date(post.createdAt), DATE_FORMAT)}</span>
              <span className="xs:hidden">{format(new Date(post.createdAt), SHORT_DATE_FORMAT)}</span>
            </p>
          </div>

          <div>
            <h3 className={cn("text-xl font-bold", isOnlyTitle && "text-2xl mt-4")}>{post.title}</h3>
            <div>
              {post.content && <FroalaEditorView model={post.content} />}
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="max-h-[512px] w-full rounded-md mt-2" />}
              {post.link && (
                <a href={post.link} target="_blank" className="text-blue-500 hover:underline cursor-pointer">
                  {post.link}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
