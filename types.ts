import {
  Comment,
  CommentProfileDownvotes,
  CommentProfileUpvotes,
  Community,
  CommunityRule,
  Member,
  Post,
  PostProfileDownvotes,
  PostProfileUpvotes,
  Profile,
} from "@prisma/client";

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
  comments: CommentWithMemberWithProfileWithVotesWithPost[];
};

export type PostWithCommentsWithCommunity = Post & {
  comments: Comment[];
  community: Community;
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type CommentWithMemberWithProfileWithVotesWithPost = Comment & {
  member: Member & {
    profile: Profile;
  };
  upvotes: CommentProfileUpvotes[];
  downvotes: CommentProfileDownvotes[];
  post: PostWithMemberWithProfileWithCommunityWithVotes;
};
