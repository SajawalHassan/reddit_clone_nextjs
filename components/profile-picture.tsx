"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  src: string | undefined;
  profileId: string;
  className?: string;
}

export const ProfilePicture = ({ src, profileId, className }: Props) => {
  const router = useRouter();

  return (
    <img
      src={src as string}
      alt="profile"
      className={cn("h-10 w-10 rounded-full cursor-pointer bg-gray-700", className)}
      onClick={() => router.push(`/main/users/${profileId}`)}
    />
  );
};
