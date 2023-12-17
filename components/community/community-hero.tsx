"use client";

import { CommunityWithMembersWithRules } from "@/types";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import qs from "query-string";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IconButton } from "../icon-button";
import { Camera, Pencil, Trash, X } from "lucide-react";
import { ActionLoading } from "@/components/action-loading";
import { useModal } from "@/hooks/use-modal-store";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { uploadFile } from "@/components/file-uploader";

export const CommunityHero = ({ communityId }: { communityId: string }) => {
  const [community, setCommunity] = useState<CommunityWithMembersWithRules>();
  const [banner, setBanner] = useState("");
  const [image, setImage] = useState("");
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [isJoiningOrLeavingCommunity, setIsJoiningOrLeavingCommunity] = useState(false);

  const { openModal } = useModal();
  const { refetchCommunityHero, setRefetchCommunityHero, currentMember, setCurrentMember, setHeaderActivePlace } = useGlobalInfo();

  const bannerUploadRef = useRef<any>(null);
  const imageUploadRef = useRef<any>(null);
  const isAdmin = currentMember?.role === MemberRole.ADMIN;

  const getCommunity = async () => {
    try {
      const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

      const response = await axios.get(url);
      const data = response.data;

      setCommunity(data.community);
      setCurrentMember(data.currentMember[0]);
      setBanner(data.community.bannerUrl || "");
      setImage(data.community.imageUrl || "");

      if (data.currentMember.length > 0) setHasJoinedCommunity(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCommunity();
  }, []);

  useEffect(() => {
    if (community) {
      setHeaderActivePlace({ text: community.uniqueName, imageUrl: community.imageUrl });
    }
  }, [community]);

  useEffect(() => {
    if (refetchCommunityHero) {
      getCommunity();
      setRefetchCommunityHero(false);
    }
  }, [refetchCommunityHero]);

  const uploadFileJSX = async (e: ChangeEvent, type: "banner" | "image") => {
    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    uploadFile(file, setIsSubmittingFile, async (url) => {
      if (type === "banner") setBanner(url);
      else setImage(url);

      if (type === "banner") await axios.patch("/api/communities", { communityId, data: { bannerUrl: url } });
      else await axios.patch("/api/communities", { communityId, data: { imageUrl: url } });
      setRefetchCommunityHero(true);
    });
  };

  const removeFile = async (type: "banner" | "image") => {
    try {
      setIsSubmittingFile(true);

      if (type === "banner") setBanner("");
      else setImage("");

      if (type === "banner") await axios.patch("/api/communities", { communityId, data: { bannerUrl: "" } });
      else await axios.patch("/api/communities", { communityId, data: { imageUrl: "" } });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingFile(false);
    }
  };

  const LeaveCommunity = async () => {
    try {
      setIsJoiningOrLeavingCommunity(true);

      await axios.patch("/api/communities/leave", { memberId: currentMember?.id, communityId });

      setCurrentMember(null);
      setHasJoinedCommunity(false);
      setRefetchCommunityHero(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoiningOrLeavingCommunity(false);
    }
  };

  const joinCommunity = async () => {
    try {
      setIsJoiningOrLeavingCommunity(true);

      const response = await axios.patch("/api/communities/join", { communityId });
      const { currentMember: member } = response.data;

      setCurrentMember(member);
      setHasJoinedCommunity(true);
      setRefetchCommunityHero(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoiningOrLeavingCommunity(false);
    }
  };

  return (
    <div suppressHydrationWarning>
      <div>
        {banner ? (
          <div className="min-h-[3rem] max-h-[192px] overflow-hidden w-full relative">
            <img src={banner} className="w-screen min-h-full" />
            {isAdmin && (
              <IconButton
                Icon={X}
                className="absolute inset-0 m-auto w-max h-max bg-red-300 hover:bg-red-400"
                IconClassName="text-white"
                onClick={() => removeFile("banner")}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-[5rem] bg-[#2D97E5] relative">
            {isAdmin && (
              <IconButton
                Icon={Camera}
                className="absolute inset-0 m-auto w-max h-max hover:bg-zinc-300/50"
                IconClassName="text-white"
                onClick={() => bannerUploadRef?.current?.click()}
              />
            )}
          </div>
        )}
        <div className="bg-white dark:bg-[#1A1A1B] flex justify-center min-h-[5rem]">
          {community && (
            <div className="lg:max-w-[984px] w-full pl-2 sm:pl-10 lg:pl-0 relative flex gap-x-2 mt-1.5">
              <div className="relative -top-5">
                <img src={image} alt={community.uniqueName} className="h-[5rem] w-[5rem] rounded-full border-4 border-white" />
                {isAdmin && (
                  <IconButton
                    Icon={Camera}
                    className="absolute inset-0 m-auto w-max h-max hover:bg-zinc-300/50"
                    IconClassName="text-white"
                    onClick={() => imageUploadRef?.current?.click()}
                  />
                )}
              </div>
              <div>
                <div className="md:flex items-center gap-x-2 h-max">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{community.name}</p>
                  {!isAdmin ? (
                    hasJoinedCommunity ? (
                      <div
                        className="hidden md:block px-7 py-1 rounded-full border border-black dark:border-white hover:bg-gray-100 dark:bg-[#1a1a1a] dark:hover:bg-[#292929] group cursor-pointer"
                        onClick={() => LeaveCommunity()}>
                        <p className="group-hover:hidden">Joined</p>
                        <p className="hidden group-hover:block">Leave</p>
                      </div>
                    ) : (
                      <div
                        className="hidden md:block px-7 py-1 rounded-full bg-black dark:bg-gray-300 dark:text-[#1A1A1B] dark:hover:opacity-90 text-white hover:bg-zinc-800 cursor-pointer"
                        onClick={() => joinCommunity()}>
                        <p className="font-bold">Join</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <button
                        className="hidden lg:block px-5 py-1 text-sm rounded-full bg-black dark:bg-gray-300 dark:text-[#1A1A1B] dark:hover:opacity-90 text-white hover:bg-zinc-800 cursor-pointer font-bold"
                        onClick={() => openModal("editCommunity", { community })}>
                        Edit community
                      </button>
                      <button
                        className="hidden lg:block px-5 py-1 text-sm rounded-full bg-red-500 text-white hover:bg-red-400 cursor-pointer font-bold"
                        onClick={() => openModal("deleteCommunity", { community })}>
                        Delete community
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <p className="font-semibold text-sm text-[#818181]">r/{community.uniqueName}</p>
                  {!isAdmin ? (
                    hasJoinedCommunity ? (
                      <div
                        className="md:hidden px-3 py-0.5 text-[11px] rounded-full border border-black dark:border-white hover:bg-gray-100 dark:bg-[#1a1a1a] dark:hover:bg-[#292929] group cursor-pointer"
                        onClick={() => LeaveCommunity()}>
                        <p className="group-hover:hidden">Joined</p>
                        <p className="hidden group-hover:block">Leave</p>
                      </div>
                    ) : (
                      <div
                        className="md:hidden px-3 py-0.5 text-[11px] rounded-full bg-black dark:bg-gray-300 dark:text-[#1A1A1B] dark:hover:opacity-90 text-white hover:bg-zinc-800 cursor-pointer"
                        onClick={() => joinCommunity()}>
                        <p className="font-bold">Join</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <button
                        className="lg:hidden p-1 sm:p-1.5 text-[11px] rounded-full bg-black dark:bg-gray-300 dark:text-[#1A1A1B] dark:hover:opacity-90 text-white hover:bg-zinc-800 cursor-pointer font-bold"
                        onClick={() => openModal("editCommunity", { community })}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="lg:hidden p-1 sm:p-1.5 text-[11px] rounded-full bg-red-500 text-white hover:bg-red-400 cursor-pointer font-bold"
                        onClick={() => openModal("editCommunity", { community })}>
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSubmittingFile && <ActionLoading isLoading={isSubmittingFile} />}
      {isJoiningOrLeavingCommunity && <ActionLoading isLoading={isJoiningOrLeavingCommunity} />}
      <input type="file" ref={bannerUploadRef} onChange={(e: ChangeEvent) => uploadFileJSX(e, "banner")} className="hidden" accept="image/*" />
      <input type="file" ref={imageUploadRef} onChange={(e: ChangeEvent) => uploadFileJSX(e, "image")} className="hidden" accept="image/*" />
    </div>
  );
};
