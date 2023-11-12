"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "@/components/ui/seperator";

export const CreateCommunityModal = () => {
  const { isOpen, type, handleClose } = useModal();

  const modalIsOpen = isOpen && type === "createCommunity";

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <p className="font-semibold text-lg">Create a community</p>
          <Separator />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
