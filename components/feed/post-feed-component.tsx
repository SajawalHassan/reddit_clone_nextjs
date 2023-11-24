import { PostWithMemberWithProfileWithCommunity } from "@/types";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { IconButton } from "../icon-button";
import { format } from "date-fns";

import dynamic from "next/dynamic";
import Image from "next/image";
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

export const PostFeedComponent = ({ post }: { post: PostWithMemberWithProfileWithCommunity }) => {
  return (
    <div className="home-component flex p-0">
      <div className="w-[4rem] bg-gray-100 p-2 rounded-l-md">
        <IconButton Icon={ArrowUpCircle} className="rounded-sm w-max" />
        <p className="text-sm font-bold text-center">Vote</p>
        <IconButton Icon={ArrowDownCircle} className="rounded-sm w-max" />
      </div>
      <div className="w-full p-2">
        <div className="flex items-center gap-x-2">
          <img src={post.community.imageUrl} alt={post.community.name} className="h-6 w-6 rounded-full cursor-pointer" />
          <div className="flex items-center gap-x-0.5">
            <p className="text-xs font-bold cursor-pointer hover:underline">r/{post.community.uniqueName}</p> ·{" "}
            <p className="text-gray-500 text-xs">
              Posted by <span className="hover:underline cursor-pointer">u/{post.member.profile.displayName}</span> at{" "}
              {format(new Date(post.createdAt), DATE_FORMAT)}
            </p>
          </div>
        </div>
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
  );
};
