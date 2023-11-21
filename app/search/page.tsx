"use client";

import { IconButton } from "@/components/icon-button";
import { HeaderSearch } from "@/components/header/header-search";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="px-2 py-4 bg-white dark:bg-[#1A1A1B] flex items-center gap-x-2">
      <IconButton Icon={ArrowLeft} onClick={() => router.push("/main")} />
      <HeaderSearch />
    </div>
  );
}
