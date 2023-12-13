import { CommunityWithMembersWithRules } from "@/types";
import { create } from "zustand";

export type ModalTypes = "createCommunity" | "editCommunity" | "deleteCommunity" | "joinCommunity";

interface ModalData {
  community?: CommunityWithMembersWithRules;
}

interface ModalStores {
  type: ModalTypes | null;
  data: ModalData;
  isOpen: Boolean;
  openModal: (type: ModalTypes, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModal = create<ModalStores>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type, data?: ModalData) => set({ type, isOpen: true, data }),
  closeModal: () => set({ isOpen: false, type: null }),
}));
