import { UserOverviewFeed } from "@/components/feed/user/user-overview-feed";

export default function UserIdPage({ params: { userId } }: { params: { userId: string } }) {
  return (
    <div className="w-full flex-grow mt-[3.5rem] px-0">
      <div className="flex justify-center sm:px-10 gap-x-4">
        <div className="space-y-4 home-component-container">
          <UserOverviewFeed />
        </div>
        {/* <div className="hidden lg:block space-y-4">
          <AboutCommunitiyHomeComponent communityId={communityId} />
          <CommunityRules communityId={communityId} />
        </div> */}
      </div>
    </div>
  );
}
