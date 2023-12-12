import { AboutCommunitiyHomeComponent } from "@/components/home-components/about-community-home-component";
import { CommunityFeed } from "@/components/feed/community-feed";
import { CreatePostHomeComponent } from "@/components/home-components/create-post-home-component";
import { CommunityHero } from "@/components/community/community-hero";
import { CommunityRules } from "@/components/community/community-rules";

export default function CommunityIdPage({ params: { communityId } }: { params: { communityId: string } }) {
  return (
    <div className="w-full flex-grow mt-[3rem] px-0">
      <CommunityHero communityId={communityId} />
      <div className="flex justify-center sm:px-10 gap-x-4 mt-[2rem]">
        <div className="space-y-4 home-component-container">
          <CreatePostHomeComponent />
          <CommunityFeed communityId={communityId} />
        </div>
        <div className="hidden lg:block space-y-4">
          <AboutCommunitiyHomeComponent communityId={communityId} />
          <CommunityRules communityId={communityId} />
        </div>
      </div>
    </div>
  );
}
