"use client";

import { uploadFile } from "@/components/file-uploader";
import { IconButton } from "@/components/icon-button";
import { AboutCommunitySkeleton } from "@/components/skeletons/about-community-skeleton";
import { Button } from "@/components/ui/button";
import { useCommunityInfo } from "@/hooks/use-community-info";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { cn } from "@/lib/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import { Cake, Camera, Loader2, Star, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const DATE_FORMAT = "yyyy";
const FULL_DATE_FORMAT = "MMM d, yyyy";

export const AboutUserHomeComponent = ({ profileId }: { profileId: string }) => {
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { viewingProfile, setViewingProfile, setHeaderActivePlace, profile: currentProfile } = useGlobalInfo();

  const bannerUploadRef = useRef<any>(null);

  const isOwner = viewingProfile?.id === currentProfile?.id;

  const router = useRouter();

  useEffect(() => {
    const getViewingProfile = async () => {
      if (viewingProfile !== null && viewingProfile.id === profileId) return setIsLoading(false);

      setViewingProfile(null);
      setIsLoading(true);

      try {
        const url = qs.stringifyUrl({ url: "/api/profile/specific", query: { profileId } });
        const res = await axios.get(url);

        setViewingProfile(res.data);
      } catch (error: any) {
        if (error.response.status === 401) redirectToSignIn();
        else console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getViewingProfile();
  }, []);

  useEffect(() => {
    if (viewingProfile) {
      setHeaderActivePlace({ text: viewingProfile.displayName, imageUrl: viewingProfile.imageUrl });
      document.title = `${viewingProfile.displayName} (u/${viewingProfile.displayName}) - Reddit Clone`;
    }
  }, [viewingProfile]);

  const uploadBanner = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    uploadFile(file, setIsUploadingBanner, async (url) => {
      setViewingProfile({ ...viewingProfile!, bannerUrl: url });
      await axios.patch("/api/profile", { data: { bannerUrl: url } });
    });
  };

  if (isLoading) return <AboutCommunitySkeleton />;

  return (
    <div className="home-component p-0 w-[20rem] h-[20rem]">
      <div className="h-[5rem] bg-[#33A8FF] w-full rounded-t-sm relative overflow-hidden">
        {viewingProfile?.bannerUrl && <img src={viewingProfile?.bannerUrl} alt={viewingProfile?.displayName} className="w-full" />}
        {isOwner &&
          (viewingProfile?.bannerUrl ? (
            <IconButton
              Icon={X}
              IconClassName="text-white h-5 w-5"
              className="absolute bottom-2 right-2 bg-red-400 hover:bg-red-600 dark:hover:bg-red-600"
              onClick={() => setViewingProfile({ ...viewingProfile!, bannerUrl: "" })}
            />
          ) : (
            <IconButton
              Icon={isUploadingBanner ? Loader2 : Camera}
              IconClassName={cn("text-blue-500 h-5 w-5", isUploadingBanner && "animate-spin")}
              className="absolute bottom-2 right-2 bg-white dark:hover:bg-gray-300"
              onClick={() => bannerUploadRef?.current?.click()}
              disabled={isUploadingBanner}
            />
          ))}
      </div>
      <div className="relative w-full flex flex-col items-center text-center h-max">
        <img
          src={viewingProfile?.imageUrl}
          alt={viewingProfile?.displayName}
          className="h-[7rem] w-[7rem] border-2 border-white rounded-full absolute -top-[3rem]"
        />
        <p className="font-semibold mt-16 text-2xl">{viewingProfile?.displayName}</p>
        {viewingProfile && (
          <p className="text-xs text-gray-500 font-bold">
            u/{viewingProfile?.displayName} · {format(new Date(viewingProfile.createdAt), DATE_FORMAT)}
          </p>
        )}
      </div>
      <div className="px-4 mt-5 space-y-4 w-full">
        <div className="flex items-center gap-x-[4rem]">
          <div>
            <p className="text-[15px] font-semibold">Karma</p>
            <div className="flex items-center gap-x-1">
              <Star className="h-3 w-3 text-blue-500" />
              <p className="text-xs">{viewingProfile?.karma}</p>
            </div>
          </div>
          <div>
            <p className="text-[15px] font-semibold">Cake day</p>
            <div className="flex items-center gap-x-1">
              <Cake className="h-3 w-3 text-blue-500" />
              {viewingProfile && <p className="text-xs">{format(new Date(viewingProfile.createdAt), FULL_DATE_FORMAT)}</p>}
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full" onClick={() => router.push("/main/create/post?plain=true")}>
          Create a post
        </Button>
      </div>
      <input type="file" ref={bannerUploadRef} onChange={(e: ChangeEvent) => uploadBanner(e)} className="hidden" accept="image/*" />
    </div>
  );
};
