import { Comment, Community, CommunityRule, Member, Post, PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

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

export type NextApiResponseSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
