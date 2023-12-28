import { UserOverviewFeed } from "@/components/feed/user-overview-feed";
import { AboutUserHomeComponent } from "@/components/home-components/user/about-user-home-component";

export default function UserIdPage({ params: { userId } }: { params: { userId: string } }) {
  console.log(userId);
  return (
    <div className="w-full flex-grow mt-[4rem] px-2 flex justify-center sm:px-10 gap-x-4">
      <UserOverviewFeed profileId={userId} />
      <div className="hidden lg:block space-y-4">
        <AboutUserHomeComponent profileId={userId} />
      </div>
    </div>
  );
}
