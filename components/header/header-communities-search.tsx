import { Input } from "@/components/ui/input";
import { Community } from "@prisma/client";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  setCommunities: Dispatch<SetStateAction<Community[] | undefined>>;
  allCommunities: Community[] | undefined;
}

export const HeaderCommunitiesSearch = ({ setCommunities, allCommunities }: Props) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setCommunities(allCommunities?.filter((community) => community));
    } else {
      setCommunities(allCommunities?.filter((community) => community.uniqueName.toLowerCase().includes(e.target.value.toLowerCase())));
    }
  };

  return (
    <Input
      placeholder="Search Communities"
      className="w-full rounded-none bg-gray-100 dark:bg-[#272729] dark:border-[#3c3c3d] border border-gray-200"
      onChange={handleOnChange}
    />
  );
};
