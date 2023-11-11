"use client";

import Image from "next/image";
import RedditLogo from "@/svgs/reddit-logo.svg";
import RedditLogoText from "@/svgs/reddit-logo-text.svg";
import RedditLogoTextDark from "@/svgs/reddit-logo-text-dark.svg";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export const Header = () => {
  const { resolvedTheme } = useTheme();

  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-10">
      <div className="flex items-center gap-x-2 cursor-pointer w-max" onClick={() => router.push("/")}>
        <Image src={RedditLogo} alt="Reddit Logo" className="h-[30px] w-[30px]" />
        {resolvedTheme === "light" && <Image src={RedditLogoText} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
        {resolvedTheme === "dark" && <Image src={RedditLogoTextDark} alt="Reddit Logo Text Dark" className="h-[60px] w-[60px]" />}
      </div>
    </div>
  );
};
