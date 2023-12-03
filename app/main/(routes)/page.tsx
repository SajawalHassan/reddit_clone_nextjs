import { HomeFeed } from "@/components/feed/home-feed";
import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";

export default function Home() {
  return (
    <div className="flex flex-col w-full flex-grow items-center justify-center space-y-2 pt-6 mt-[4rem]">
      <CreatePostHomeComponent />
      <HomeFeed />
    </div>
  );
}
