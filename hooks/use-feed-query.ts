import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Dispatch, SetStateAction } from "react";

interface Props {
  query: string;
  apiUrl: string;
  communityId?: string;
  profileId?: string;
  feedType?: "new" | "hot";
}

export const useFeedQuery = ({ query, apiUrl, communityId, feedType, profileId }: Props) => {
  const fetchCommunities = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: {
            cursor: pageParam,
            communityId,
            feedType,
            profileId,
          },
        },
        { skipNull: true }
      );

      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const { data, fetchNextPage, hasNextPage, status, isFetching, refetch } = useInfiniteQuery({
    queryKey: [query],
    queryFn: fetchCommunities,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetching,
    refetch,
  };
};
