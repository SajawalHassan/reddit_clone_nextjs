import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface Props {
  query: string;
  apiUrl: string;
  communityId?: string;
  feedType?: "new" | "hot";
}

export const useFeedQuery = ({ query, apiUrl, communityId, feedType }: Props) => {
  const fetchCommunities = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          communityId,
          feedType,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
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
