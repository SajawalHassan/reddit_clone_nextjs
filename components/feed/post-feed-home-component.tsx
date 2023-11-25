import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { IconButton } from "../icon-button";
import { format } from "date-fns";

import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
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

export const PostFeedHomeComponent = ({ post }: { post: PostWithMemberWithProfileWithCommunity }) => {
  const isOnlyTitle = !post.content && !post.imageUrl && !post.link;

  return (
    <div className="home-component flex p-0">
      <div className="w-[4rem] bg-gray-100 dark:bg-[#151516] p-2 flex flex-col items-center rounded-l-md">
        <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max" />
        <p className="text-sm font-bold">{post.upvotes}</p>
        <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max" />
      </div>
      <div className="w-full p-2">
        <div className="flex items-center gap-x-1">
          <img src={post.community.imageUrl} alt={post.community.name} className="h-6 w-6 rounded-full cursor-pointer hover:ring-2 ring-gray-200" />
          <p className="text-xs font-bold cursor-pointer hover:underline">r/{post.community.uniqueName}</p> ·{" "}
          <p className="text-gray-500 text-xs">
            Posted by <span className="hover:underline cursor-pointer">u/{post.member.profile.displayName}</span> at{" "}
            {format(new Date(post.createdAt), DATE_FORMAT)}
          </p>
        </div>
        <div>
          <h3 className={cn("text-xl font-bold", isOnlyTitle && "mt-2.5")}>
            {post.title} | <span className="text-sm text-gray-200">{post.id}</span>
          </h3>
          <div>
            {post.content && <FroalaEditorView model={post.content} />}
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="max-h-[512px] w-full" />}
            {post.link && (
              <a href={post.link} target="_blank" className="text-blue-500 hover:underline cursor-pointer">
                {post.link}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
