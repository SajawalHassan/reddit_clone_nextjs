"use client";

import { Input } from "@/components/ui/input";
import { ProfilePicture } from "@/components/profile-picture";
import { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import axios from "axios";
import { IconButton } from "@/components/icon-button";
import { Image, Link as LinkIcon } from "lucide-react";
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

  useEffect(() => {
    router.prefetch("/main/create/post");
  }, []);

  const createPost = (url: string) => {
    router.push(url);
  };

  return (
    <div className="px-2 home-component-container">
      <div className="flex items-center gap-x-2 home-component">
        <ProfilePicture src={profile?.imageUrl} profileId={profile?.id as string} />
        <Input placeholder="Create post" onClick={() => createPost("/main/create/post?plain=true")} className="rounded-sm" />
        <IconButton Icon={Image} onClick={() => createPost("/main/create/post?media=true")} className="text-zinc-500" />
        <IconButton Icon={LinkIcon} onClick={() => createPost("/main/create/post?link=true")} />
      </div>
    </div>
  );
};
