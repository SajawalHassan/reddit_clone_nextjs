import { CommunityWithMembersWithRules } from "@/types";
import { Member } from "@prisma/client";
import { create } from "zustand";

interface useCommunityInfoStore {
  community: CommunityWithMembersWithRules | null;
  setCommunity: (community: CommunityWithMembersWithRules | null) => void;
  currentMember: Member | null;
  setCurrentMember: (member: Member | null) => void;
}

export const useCommunityInfo = create<useCommunityInfoStore>((set) => ({
  community: null,
  setCommunity: (community) => set({ community }),
  currentMember: null,
  setCurrentMember: (currentMember) => set({ currentMember }),
}));
