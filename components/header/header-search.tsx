import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import qs from "query-string";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";
import { HeaderSearchItem } from "./header-search-item";
import { CommunityWithMembers } from "@/types";

interface Props {
  className?: string;
}

export const HeaderSearch = ({ className }: Props) => {
  const [filteredCommunities, setFilteredCommunities] = useState<CommunityWithMembers[]>();
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const showResults = searchValue !== "" && inputIsFocused;

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (!e.target.value) {
      setFilteredCommunities([]);
      setFilteredProfiles([]);
      return;
    }

    try {
      setIsLoading(true);
      setFilteredCommunities([]);
      setFilteredProfiles([]);

      const url = qs.stringifyUrl({ url: "/api/search", query: { searchText: e.target.value } });
      const result = await axios.get(url);

      setFilteredCommunities(result.data.communities);
      setFilteredProfiles(result.data.profiles);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex-grow relative md:flex-col", className)}>
      <div
        className={cn(
          "flex items-center gap-x-2 w-full bg-gray-100 dark:bg-[#272729] dark:border-[#3c3c3d] border border-gray-200 px-4 hover:bg-white hover:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white focus-within:bg-white focus-within:border-blue-500 focus-within:dark:bg-[#1A1A1B] focus-within:dark:border-white",
          showResults ? "rounded-t-3xl rounded-b-none focus-within:border-b-0" : "rounded-3xl"
        )}>
        <Search className="text-zinc-600" />
        <Input
          placeholder="Search Reddit"
          className="bg-transparent border-none focus-within:ring-0 focus-within:ring-offset-0 px-0"
          onChange={handleOnChange}
          value={searchValue}
          onFocus={() => setInputIsFocused(true)}
        />
      </div>
      {showResults && <div className="fixed inset-0 h-full w-full z-20" onClick={() => setInputIsFocused(false)} />}
      {showResults && (
        <div className="bg-white dark:bg-[#1A1A1B] w-full absolute top-9 z-30 py-4 max-h-[20rem] overflow-scroll border border-blue-500 dark:border-gray-200 border-t-0">
          {isLoading && (
            <div className="flex items-center justify-center w-full h-[10rem]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {filteredCommunities?.length! > 0 && <p className="mx-5 mb-1 text-sm font-bold">Communities</p>}

          {!isLoading &&
            filteredCommunities?.map((community: CommunityWithMembers) => (
              <HeaderSearchItem
                setInputIsFocused={setInputIsFocused}
                key={community.id}
                type="community"
                communityId={community.id}
                name={community.uniqueName}
                imageUrl={community.imageUrl}
                members={community.members.length}
              />
            ))}

          {filteredProfiles?.length! > 0 && <p className="mx-5 mb-1 mt-4 text-sm font-bold">Users</p>}

          {!isLoading &&
            filteredProfiles?.map((profile: Profile) => (
              <HeaderSearchItem
                setInputIsFocused={setInputIsFocused}
                key={profile.id}
                type="user"
                profileId={profile.id}
                name={profile.displayName}
                imageUrl={profile.imageUrl}
                karma={profile.karma}
              />
            ))}

          {!isLoading && filteredCommunities?.length! < 1 && filteredProfiles?.length! < 1 && (
            <div className="h-[10rem] flex items-center text-center justify-center">
              <p className="font-semibold text-lg">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
