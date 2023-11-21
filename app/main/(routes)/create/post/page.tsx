import { CommunitySelecter } from "@/components/posts/community-selecter";
import { CreatePostForm } from "@/components/posts/create-post-form";
import { Separator } from "@/components/ui/seperator";

export default function CreatePostPage() {
  return (
    <div className="flex-auto flex items-center justify-center">
      <div className="w-full flex-grow max-w-[40rem]">
        <p className="font-semibold">Create a post</p>
        <Separator className="my-2" />
        <CommunitySelecter />
        <CreatePostForm />
      </div>
    </div>
  );
}
