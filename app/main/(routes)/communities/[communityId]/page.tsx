import { AboutCommunitiyHomeComponent } from "@/components/home-components/about-community-home-component";
import { CommunityFeed } from "@/components/feed/community-feed";
import { CreatePostHomeComponent } from "@/components/home-components/create-post-home-component";

export default function CommunityIdPage({ params: { communityId } }: { params: { communityId: string } }) {
  return (
    <div className="flex w-full flex-grow justify-center mt-[5rem] px-0 sm:px-10 gap-x-4">
      <div className="space-y-4 home-component-container">
        <CreatePostHomeComponent />
        <CommunityFeed communityId={communityId} />
      </div>
      <div className="hidden lg:block space-y-4">
        <AboutCommunitiyHomeComponent communityId={communityId} />
      </div>
    </div>
  );
}
