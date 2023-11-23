import { PostWithMemberWithCommunity } from "@/types";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

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

export const PostFeedComponent = ({ post }: { post: PostWithMemberWithCommunity }) => {
  return (
    <div className="p-4 bg-white rounded-md border">
      <p className="text-2xl font-bold">
        {post.title} | {post.community.name}
      </p>
      {post.imageUrl && <Image width={500} height={500} src={post.imageUrl} alt={post.title} className="" />}
      {post.link && (
        <a href={post.link} className="text-blue-500" target="_blank">
          {post.link}
        </a>
      )}
      {post.content && <FroalaEditorView model={post.content} />}
    </div>
  );
};
