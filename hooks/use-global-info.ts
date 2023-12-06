import { LucideIcon } from "lucide-react";
import { create } from "zustand";

type headerActivePlaceType = {
  text: string;
  imageUrl?: string;
  Icon?: LucideIcon;
};

interface useGlobalInfoStore {
  headerActivePlace: headerActivePlaceType;
  setHeaderActivePlace: (newHeaderActivePlace: headerActivePlaceType) => void;
}

export const useGlobalInfo = create<useGlobalInfoStore>((set) => ({
  headerActivePlace: { text: "" },
  setHeaderActivePlace: (newHeaderActivePlace) => set({ headerActivePlace: newHeaderActivePlace }),
}));
