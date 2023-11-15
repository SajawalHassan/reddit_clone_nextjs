import { ArrowDown, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { useUser } from "@clerk/nextjs";
import { getCurrentProfile } from "@/lib/current-profile";

export const CommunityDisplayer = () => {
  const [communities, setCommunities] = useState([]);

  const pathname = usePathname();
  const user = useUser();
  const profile = getCurrentProfile(user);
  console.log(profile);

  //   useEffect(() => {
  //     const getCommunities = async () => {
  //         const communities = await db.community.findMany({
  //             where: {
  //                 members: {
  //                     some: {
  //                         profileId: profile?.id
  //                     }
  //                 }
  //             }
  //         })

  //         console.log(communities)
  //     }

  //     getCommunities()
  //   }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <div className="flex items-center justify-between max-w-[15rem] p-2 border border-transparent hover:border-zinc-200 cursor-pointer">
          <div className="flex items-center gap-x-2">
            <Home className="text-black" />
            <p className="text-sm font-bold">Home</p>
          </div>
          <ArrowDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[15rem]">Hello</DropdownMenuContent>
    </DropdownMenu>
  );
};
