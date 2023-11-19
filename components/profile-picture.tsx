"use client";

import { useRouter } from "next/navigation";

interface Props {
  src: string | undefined;
  profileId: string;
}

export const ProfilePicture = ({ src, profileId }: Props) => {
  const router = useRouter();

  return (
    <img
      src={src as string}
      alt="profile"
      className="h-10 w-10 rounded-full cursor-pointer bg-gray-700"
      onClick={() => router.push(`/main/users/${profileId}`)}
    />
  );
};
