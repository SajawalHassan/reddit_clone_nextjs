import { HomeFeed } from "@/components/feed/home-feed";
import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";
import { QuickActionsHomeComponent } from "@/components/quick-actions-home-component";

export default function Home() {
  return (
    <div className="flex w-full flex-grow justify-center mt-[5rem] px-10 gap-x-4">
      <div className="space-y-2 home-component-container">
        <CreatePostHomeComponent />
        <HomeFeed />
      </div>
      <div>
        <QuickActionsHomeComponent />
      </div>
    </div>
  );
}
