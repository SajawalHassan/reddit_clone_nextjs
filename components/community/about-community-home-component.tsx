"use client";

import { Community, Member, MemberRole } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import qs from "query-string";
import { useEffect, useState } from "react";

export const AboutCommunitiyHomeComponent = ({ communityId }: { communityId: string }) => {
  const [community, setCommunity] = useState<Community>();
  const [currentMember, setCurrentMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCommunity = async () => {
      setIsLoading(true);

      try {
        const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

        const response = await axios.get(url);
        setCommunity(response.data.community);
        setCurrentMember(response.data.currentMember[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCommunity();
  }, []);

  const isAdmin = currentMember?.role === MemberRole.ADMIN;

  if (isLoading) return;

  return (
    <div className="home-component p-0 w-[20rem] pb-5">
      <div className="py-3 px-2 bg-blue-500">
        <p className="font-bold text-sm text-white">About community</p>
      </div>
      <div>
        {isAdmin ? (
          community?.description ? (
            <div className="flex items-center">
              <p className="text-sm">{community.description}</p>
              <Pencil />
            </div>
          ) : (
            <p className="p-2 w-1/2 rounded-sm border-2 border-blue-500">Edit description</p>
          )
        ) : community?.description ? (
          <p className="text-sm">{community?.description}</p>
        ) : (
          <p className="text-sm">Welcome to r/{community?.uniqueName}</p>
        )}
      </div>
    </div>
  );
};
