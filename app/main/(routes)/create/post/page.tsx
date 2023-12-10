import { CreatePostForm } from "@/components/forms/post/create-post-form";
import { Separator } from "@/components/ui/seperator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit to Reddit",
};

export default function CreatePostPage() {
  return (
    <div className="flex-auto flex items-center justify-center mx-2">
      <div className="w-full flex-grow max-w-[40rem]">
        <p className="font-semibold">Create a post</p>
        <Separator className="my-2" />
        <CreatePostForm />
      </div>
    </div>
  );
}
