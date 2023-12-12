import { Comment, Community, CommunityRule, Member, Post, PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";

export type CommunityWithMembersWithRules = Community & {
  members: Member[];
  rules: CommunityRule[];
};

export type PostWithMemberWithProfileWithCommunityWithVotes = Post & {
  member: Member & {
    profile: Profile;
  };
  community: Community;
  upvotes: PostProfileUpvotes[];
  downvotes: PostProfileDownvotes[];
  comments: Comment[];
};

export type PostWithCommentsWithCommunity = Post & {
  comments: Comment[];
  community: Community;
};
