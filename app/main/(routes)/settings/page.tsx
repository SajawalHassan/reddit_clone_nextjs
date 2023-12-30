import { UserSettingsForm } from "@/components/user/user-settings-form";
import { getCurrentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

export default async function UserIdPage() {
  const profile = await getCurrentProfile();
  if (!profile) return redirectToSignIn();

  return (
    <div className="flex h-full pt-[5rem] bg-white dark:bg-[#1A1A1B]">
      <UserSettingsForm profile={profile} />
    </div>
  );
}
