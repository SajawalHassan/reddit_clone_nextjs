import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";

export default function Home() {
  return (
    <div className="flex flex-grow items-center justify-center space-x-2 pt-6">
      <CreatePostHomeComponent />
    </div>
  );
}
