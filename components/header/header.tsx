"use client";

import Image from "next/image";
import RedditLogo from "@/svgs/reddit-logo.svg";
import RedditLogoText from "@/svgs/reddit-logo-text.svg";
import RedditLogoTextDark from "@/svgs/reddit-logo-text-dark.svg";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

export const Header = () => {
  const { resolvedTheme } = useTheme();
  const { handleOpen } = useModal();

  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-10 flex items-center gap-x-2">
      <div className="flex items-center gap-x-2 cursor-pointer w-max" onClick={() => router.push("/")}>
        <Image src={RedditLogo} alt="Reddit Logo" className="h-[30px] w-[30px]" />
        <Image src={resolvedTheme === "dark" ? RedditLogoTextDark : RedditLogoText} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />
      </div>
      <div className="p-1.5 cursor-pointer rounded-full bg-zinc-200 dark:bg-transparent" onClick={() => handleOpen("createCommunity")}>
        <Plus />
      </div>
    </div>
  );
};
