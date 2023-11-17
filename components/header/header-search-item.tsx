import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  type: "community" | "user";
  name: string;
  imageUrl: string;
  members?: number;
  karma?: number;
  communityId?: string;
  profileId?: string;
  setInputIsFocused: Dispatch<SetStateAction<boolean>>;
}

export const HeaderSearchItem = ({ type, name, imageUrl, members, karma, communityId, profileId, setInputIsFocused }: Props) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const formattedMembersCount = formatter.format(members as number);
  const formattedKarmaCount = formatter.format(karma as number);

  const router = useRouter();

  const handleOnClick = () => {
    if (type === "community") router.push(`/main/communities/${communityId}`);
    if (type === "user") router.push(`/main/users/${profileId}`);

    setInputIsFocused(false);
  };

  return (
    <div className="px-5 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-x-2 cursor-pointer" onClick={handleOnClick}>
      <img src={imageUrl} alt="" className="rounded-full h-8 w-8" />
      <div>
        <p className="font-semibold">{type === "community" ? `r/${name}` : `u/${name}`}</p>
        <p className="text-sm text-gray-700 dark:text-zinc-400">
          {type} · {type === "community" ? `${formattedMembersCount} members` : `${formattedKarmaCount} karma`}
        </p>
      </div>
    </div>
  );
};
