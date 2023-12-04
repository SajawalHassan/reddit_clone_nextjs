import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import axios from "axios";
import { ArrowDownCircle, Eye, LogOut, PlusCircle, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { HeaderProfileMenuHeading } from "./header-profile-menu-heading";
import { Separator } from "@/components/ui/seperator";
import { HeaderProfileMenuItem } from "./header-profile-menu-item";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useClerk } from "@clerk/nextjs";
import { useModal } from "@/hooks/use-modal-store";
import { ProfilePicture } from "../profile-picture";

export const HeaderProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);

  const router = useRouter();

  const { setTheme, resolvedTheme } = useTheme();
  const { signOut } = useClerk();
  const { openModal } = useModal();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get("/api/profile");

        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const formattedKarma = formatter.format(profile?.karma as number);

  return (
    <div className="relative">
      <div
        onClick={() => setMenuIsOpen(true)}
        className={cn(
          "flex items-center justify-between gap-x-5 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 py-1.5 px-2 cursor-pointer lg:w-[13rem]",
          menuIsOpen && "border-gray-200 dark:border-zinc-800"
        )}>
        {formattedKarma.toLowerCase() !== "nan" && (
          <div className="hidden lg:flex gap-x-1">
            <ProfilePicture src={profile?.imageUrl} profileId={profile?.id as string} className="h-8 w-8" />
            <div>
              <p className="font-bold text-xs">{profile?.displayName}</p>
              <p className="font-bold text-zinc-500 text-xs">{formattedKarma} karma</p>
            </div>
          </div>
        )}
        <ArrowDownCircle className="w-6 h-6 text-black dark:text-white lg:text-zinc-700 lg:dark:text-zinc-700" />
      </div>
      {menuIsOpen && <div className="z-20 fixed inset-0 h-full w-full" onClick={() => setMenuIsOpen(false)} />}
      {menuIsOpen && (
        <div className="absolute right-0 w-[15rem] bg-white dark:bg-[#1A1A1B] dark:text-white border border-zinc-200 dark:border-zinc-800 py-5 z-30 space-y-2">
          <HeaderProfileMenuHeading Icon={UserCircle} text="My Stuff" />
          <div>
            <HeaderProfileMenuItem
              setMenuIsOpen={setMenuIsOpen}
              text="Online Status"
              useSwitch={true}
              switchValue={onlineStatus}
              switchFunction={() => setOnlineStatus(!onlineStatus)}
            />
            <HeaderProfileMenuItem setMenuIsOpen={setMenuIsOpen} text="Profile" onClick={() => router.push(`/main/users/${profile?.id}`)} />
            <HeaderProfileMenuItem
              setMenuIsOpen={setMenuIsOpen}
              text="User Settings"
              onClick={() => router.push(`/main/users/${profile?.id}/settings`)}
            />
          </div>
          <Separator />
          <HeaderProfileMenuHeading Icon={Eye} text="View Options" />
          <HeaderProfileMenuItem
            setMenuIsOpen={setMenuIsOpen}
            text="Dark Mode"
            useSwitch={true}
            switchValue={resolvedTheme === "dark"}
            switchFunction={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          />
          <Separator />
          <HeaderProfileMenuItem
            setMenuIsOpen={setMenuIsOpen}
            Icon={PlusCircle}
            text="Create Community"
            onClick={() => openModal("createCommunity")}
          />
          <HeaderProfileMenuItem setMenuIsOpen={setMenuIsOpen} Icon={LogOut} text="Logout" onClick={() => signOut()} />
        </div>
      )}
    </div>
  );
};
