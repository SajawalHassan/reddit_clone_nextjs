import { UserFeedsController } from "@/components/feed/user/user-feeds-controller";
import { AboutUserHomeComponent } from "@/components/home-components/user/about-user-home-component";
import { UserFeedTopbar } from "@/components/user/user-feed-topbar";

export default function UserIdPage({ params: { userId } }: { params: { userId: string } }) {
  return (
    <div className="w-full flex-grow mt-[3rem]">
      <UserFeedTopbar profileId={userId} />
      <div className="flex justify-center gap-x-4 mt-[1rem] px-2 sm:px-10">
        <UserFeedsController profileId={userId} />
        <div className="hidden lg:block space-y-4">
          <AboutUserHomeComponent profileId={userId} />
        </div>
      </div>
    </div>
  );
}
