"use client";

import Image from "next/image";
import RedditLogo from "@/svgs/reddit-logo.svg";
import RedditLogoText from "@/svgs/reddit-logo-text.svg";
import RedditLogoTextDark from "@/svgs/reddit-logo-text-dark.svg";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { resolvedTheme } = useTheme();
  const { openModal } = useModal();

  const router = useRouter();
  if (!isMounted) return <div className="bg-white dark:bg-[#1A1A1B] h-[60px] animate-pulse"></div>;

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-10 flex items-center gap-x-2">
      <div className="flex items-center gap-x-2 cursor-pointer w-max" onClick={() => router.push("/")}>
        <Image src={RedditLogo} alt="Reddit Logo" className="h-[30px] w-[30px]" />
        {resolvedTheme === "dark" && <Image src={RedditLogoTextDark} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
        {resolvedTheme === "light" && <Image src={RedditLogoText} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
      </div>
      <div className="p-1.5 cursor-pointer rounded-full bg-zinc-200 dark:bg-transparent" onClick={() => openModal("createCommunity")}>
        <Plus />
      </div>
    </div>
  );
};
