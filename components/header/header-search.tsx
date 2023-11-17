import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import qs from "query-string";
import { Community, Profile } from "@prisma/client";
import { cn } from "@/lib/utils";

export const HeaderSearch = () => {
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>();
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const showResults = searchValue !== "";

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
    <div className="flex-grow relative">
      <div
        className={cn(
          "flex items-center gap-x-2 w-full bg-gray-100 dark:bg-[#272729] dark:border-[#3c3c3d] border border-gray-200 px-4 hover:bg-white hover:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white focus-within:bg-white focus-within:border-blue-500 focus-within:dark:bg-[#1A1A1B] focus-within:dark:border-white",
          showResults ? "rounded-t-3xl rounded-b-none" : "rounded-3xl"
        )}>
        <Search className="text-zinc-600" />
        <Input
          placeholder="Search Reddit"
          className="bg-transparent border-none focus-within:ring-0 focus-within:ring-offset-0 px-0"
          onChange={handleOnChange}
          value={searchValue}
        />
      </div>
      {showResults && (
        <div className="bg-[#1A1A1B] w-full absolute min-h-[10rem] z-50">
          {isLoading && (
            <div className="flex items-center justify-center w-full h-[10rem]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {filteredCommunities?.length! > 0 && <p className="text-xs font-bold uppercase">Communities</p>}

          {!isLoading &&
            filteredCommunities?.map((community: Community) => (
              <div key={community.id}>
                <p>r/{community.uniqueName}</p>
              </div>
            ))}

          {filteredProfiles?.length! > 0 && <p className="text-xs font-bold uppercase">Users</p>}

          {!isLoading &&
            filteredProfiles?.map((profile: Profile) => (
              <div key={profile.id}>
                <p>{profile.displayName}</p>
              </div>
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
