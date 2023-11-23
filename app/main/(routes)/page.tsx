import { HomeFeed } from "@/components/feed/home-feed";
import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";

export default function Home() {
  return (
    <div className="flex flex-col w-full flex-grow items-center justify-center space-x-2 pt-6">
      <CreatePostHomeComponent />
      <HomeFeed />
    </div>
  );
}
