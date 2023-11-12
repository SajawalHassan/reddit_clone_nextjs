"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";

export const CreateCommunityModal = () => {
  const { isOpen, type, handleClose } = useModal();

  const modalIsOpen = isOpen && type === "createCommunity";

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleClose}>
      <DialogContent>
        <p className="text-black font-bold">Hello!</p>
      </DialogContent>
    </Dialog>
  );
};
