import { Input } from "@/components/ui/input";
import { Community } from "@prisma/client";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  setCommunities: Dispatch<SetStateAction<Community[] | undefined>>;
  allCommunities: Community[] | undefined;
}

export const CommunitiesSelectionSearch = ({ setCommunities, allCommunities }: Props) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setCommunities(allCommunities?.filter((community) => community));
    } else {
      setCommunities(allCommunities?.filter((community) => community.uniqueName.toLowerCase().includes(e.target.value.toLowerCase())));
    }
  };

  return <Input placeholder="Search Communities" className="" onChange={handleOnChange} />;
};
