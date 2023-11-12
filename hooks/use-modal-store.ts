import { create } from "zustand";

export type ModalTypes = "createCommunity";

interface ModalStores {
  type: ModalTypes | null;
  isOpen: Boolean;
  handleOpen: (type: ModalTypes) => void;
  handleClose: () => void;
}

export const useModal = create<ModalStores>((set) => ({
  type: null,
  isOpen: false,
  handleOpen: (type) => set({ type, isOpen: true }),
  handleClose: () => set({ isOpen: false, type: null }),
}));
