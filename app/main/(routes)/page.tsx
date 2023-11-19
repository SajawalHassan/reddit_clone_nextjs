import { CreatePost } from "@/components/posts/create-post";

export default function Home() {
  return (
    <div className="flex flex-grow items-center justify-center space-x-2 pt-6">
      <CreatePost />
    </div>
  );
}
