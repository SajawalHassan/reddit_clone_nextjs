import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface Props {
  query: string;
  apiUrl: string;
}

export const useFeedQuery = ({ query, apiUrl }: Props) => {
  const fetchCommunities = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [query],
    queryFn: fetchCommunities,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: Infinity,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
