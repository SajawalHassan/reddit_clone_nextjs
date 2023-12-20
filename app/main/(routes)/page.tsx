import { HomeFeed } from "@/components/feed/home-feed";
import { CreatePostHomeComponent } from "@/components/home-components/create-post-home-component";
import { HomeFeedQuickActionsHomeComponent } from "@/components/home-components/home-feed-quick-actions-home-component";
import { RecentPosts } from "@/components/recent-posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reddit clone - Dive into anything",
};

export default function Home() {
  return (
    <div className="flex w-full flex-grow justify-center mt-[5rem] px-0 sm:px-10 gap-x-4">
      <div className="space-y-4 home-component-container">
        <CreatePostHomeComponent />
        <HomeFeed />
      </div>
      <div className="hidden lg:block space-y-4">
        <HomeFeedQuickActionsHomeComponent />
        <RecentPosts />
      </div>
    </div>
  );
}
