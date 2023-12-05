import { create } from "zustand";

interface useLoadingStore {
  communityShouldLoad: boolean;
  setCommunityShouldLoad: (value: boolean) => void;
}

export const useLoading = create<useLoadingStore>((set) => ({
  communityShouldLoad: false,
  setCommunityShouldLoad: (value) => set({ communityShouldLoad: value }),
}));
