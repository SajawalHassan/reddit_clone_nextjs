import { AboutCommunitiyHomeComponent } from "@/components/community/about-community-home-component";
import { CommunityFeed } from "@/components/feed/community-feed";
import { CreatePostHomeComponent } from "@/components/posts/create-post-home-component";

export default function CommunityIdPage({ params: { communityId } }: { params: { communityId: string } }) {
  return (
    <div className="flex w-full flex-grow justify-center mt-[5rem] px-10 gap-x-4">
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
