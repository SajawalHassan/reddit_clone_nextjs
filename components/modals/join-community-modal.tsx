"use client";

import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const JoinCommunityModal = () => {
  const { isOpen, type, closeModal, data } = useModal();
  const { community } = data;

  const [isLoading, setIsLoading] = useState(false);

  const modalIsOpen = isOpen && type === "joinCommunity";
  const router = useRouter();

  const joinCommunity = async () => {
    try {
      setIsLoading(true);

      await axios.patch("/api/communities/join", { communityId: community?.id });

      router.push(`/main/create/post?plain=true&preselected=${community?.id}`);
      handleModalClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleModalClose}>
      <DialogContent className="dark:bg-[#161718]">
        <DialogHeader>
          <p className="font-semibold text-lg text-center">Join r/{community?.uniqueName}?</p>
          <p className="text-xs text-gray-600 text-center">In order to create a post in r/{community?.uniqueName} you must be a member.</p>
        </DialogHeader>
        <div className="flex items-center gap-x-2 justify-end">
          <Button onClick={joinCommunity} variant="primary" disabled={isLoading}>
            Join Community
          </Button>
          <Button variant="secondary" onClick={handleModalClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
