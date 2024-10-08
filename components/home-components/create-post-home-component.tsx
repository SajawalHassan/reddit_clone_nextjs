"use client";

import axios from "axios";

import { Input } from "@/components/ui/input";
import { ProfilePicture } from "@/components/profile-picture";
import { useEffect } from "react";
import { IconButton } from "@/components/icon-button";
import { Image, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useProfileInfo } from "@/hooks/use-profile-info";

export const CreatePostHomeComponent = () => {
  const router = useRouter();

  const { profile, setProfile } = useProfileInfo();

  useEffect(() => {
    const getProfile = async () => {
      if (profile !== null) return;

      try {
        const response = await axios.get("/api/profile");

        setProfile(response.data);
      } catch (error: any) {
        if (error.response.status === 401) console.log("Unauthorized");
        else console.log(error);
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
        <ProfilePicture src={profile?.imageUrl} profileId={profile?.id as string} className="min-h-10 max-h-10" />
        <Input placeholder="Create post" onClick={() => createPost("/main/create/post?plain=true")} className="rounded-sm" />
        <IconButton Icon={Image} onClick={() => createPost("/main/create/post?media=true")} className="text-zinc-500" />
        <IconButton Icon={LinkIcon} onClick={() => createPost("/main/create/post?link=true")} />
      </div>
    </div>
  );
};
