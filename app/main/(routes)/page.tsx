import { HomeFeed } from "@/components/feed/home-feed";
import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";
import { QuickActionsHomeComponent } from "@/components/quick-actions-home-component";
import { RecentPosts } from "@/components/recent-posts";

export default function Home() {
  return (
    <div className="flex w-full flex-grow justify-center mt-[5rem] px-0.5 sm:px-10 gap-x-4">
      <div className="space-y-4 home-component-container">
        <CreatePostHomeComponent />
        <HomeFeed />
      </div>
      <div className="hidden lg:block space-y-4">
        <QuickActionsHomeComponent />
        <RecentPosts />
      </div>
    </div>
  );
}
