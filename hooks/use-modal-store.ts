import { create } from "zustand";

export type ModalTypes = "createCommunity";

interface ModalStores {
  type: ModalTypes | null;
  isOpen: Boolean;
  openModal: (type: ModalTypes) => void;
  closeModal: () => void;
}

export const useModal = create<ModalStores>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type) => set({ type, isOpen: true }),
  closeModal: () => set({ isOpen: false, type: null }),
}));
