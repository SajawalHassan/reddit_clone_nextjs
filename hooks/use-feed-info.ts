import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { create } from "zustand";

interface useFeedInfoStore {
  feedPosts: PostWithMemberWithProfileWithCommunityWithVotes[];
  setFeedPosts: (feedPosts: PostWithMemberWithProfileWithCommunityWithVotes[]) => void;
}

export const useFeedInfo = create<useFeedInfoStore>((set) => ({
  feedPosts: [],
  setFeedPosts: (feedPosts) => set({ feedPosts: feedPosts }),
}));
