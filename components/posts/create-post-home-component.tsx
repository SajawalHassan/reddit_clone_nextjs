"use client";

import { Input } from "@/components/ui/input";
import { ProfilePicture } from "@/components/profile-picture";
import { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import axios from "axios";
import { HeaderIconButton } from "@/components/header/header-icon-button";
import { Image, Link } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreatePostHomeComponent = () => {
  const [profile, setProfile] = useState<Profile>();

  const router = useRouter();

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

  return (
    <div className="flex items-center gap-x-2 home-component">
      <ProfilePicture src={profile?.imageUrl} profileId={profile?.id as string} />
      <Input placeholder="Create post" onClick={() => router.push("/main/create/post")} />
      <HeaderIconButton Icon={Image} onClick={() => router.push("/main/create/post?media=true")} />
      <HeaderIconButton Icon={Link} onClick={() => router.push("/main/create/post?link=true")} />
    </div>
  );
};
