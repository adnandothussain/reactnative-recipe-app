import * as React from "react";
import {
  graphql,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useRecoilValue } from "recoil";
import ScreenCenterSpinner from "src/components/Spinner/ScreenCenterSpinner.react";
import { usePrevious } from "src/hooks/usePrevious";
import { SearchRestaurantListQuery } from "src/services/graphql/__generated__/SearchRestaurantListQuery.graphql";
import { SearchRestaurantQuery } from "src/services/graphql/__generated__/SearchRestaurantQuery.graphql";
import { SearchRestaurants_restaurant$key } from "src/services/graphql/__generated__/SearchRestaurants_restaurant.graphql";
import { searchRecipesAtom } from "./searchRecipesAtom";
import RestaurantList from "./RestaurantList.react";

const query = graphql`
  query SearchRestaurantQuery($queryString: String) {
    ...SearchRestaurants_restaurant @arguments(queryString: $queryString)
  }
`;

const paginationQuery = graphql`
  fragment SearchRestaurants_restaurant on Query
  @refetchable(queryName: "SearchRestaurantListQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    queryString: { type: "String" }
  ) {
    searchRestraunts(first: $count, after: $cursor, queryString: $queryString)
      @connection(key: "SearchRestaurantListQuery_searchRestraunts") {
      edges {
        node {
          _id
          name
          image
          street
          city
          tags
          priceRange
        }
      }
    }
  }
`;

const SearchRestaurantListContainer: React.FC<{
  queryRef: SearchRestaurants_restaurant$key;
}> = ({ queryRef }) => {
  const { data, hasNext, isLoadingNext, loadNext, refetch } =
    usePaginationFragment<
      SearchRestaurantListQuery,
      SearchRestaurants_restaurant$key
    >(paginationQuery, queryRef);

  const searchQuery = useRecoilValue(searchRecipesAtom);

  const { val: previousQuery, setVal: setPreviousQuery } = usePrevious({
    type: "Restaurant",
    query: "",
  });

  React.useEffect(() => {
    if (
      searchQuery.type === "Restaurant" &&
      searchQuery.query !== previousQuery.query
    ) {
      setPreviousQuery(searchQuery);
      refetch({ queryString: searchQuery.query });
    }
  }, [searchQuery]);

  const loadMore = React.useCallback(() => {
    if (!hasNext || isLoadingNext) {
      return;
    }
    setTimeout(loadNext, 1000);
  }, [hasNext, isLoadingNext, loadNext]);

  const handleRefresh = React.useCallback(() => {
    refetch({ queryString: "" }, { fetchPolicy: "network-only" });
  }, []);

  return (
    <RestaurantList
      data={data}
      title="Restaurants Nearby"
      isLoadingNext={isLoadingNext}
      refresh={handleRefresh}
      loadMore={loadMore}
    />
  );
};

const SearchRestaurantContainer: React.FC<{
  queryRef: PreloadedQuery<SearchRestaurantQuery>;
}> = ({ queryRef }) => {
  const data = usePreloadedQuery(query, queryRef);

  return <SearchRestaurantListContainer queryRef={data} />;
};

export const SearchRestaurant: React.FC = () => {
  const [queryRef, loadQuery] = useQueryLoader<SearchRestaurantQuery>(query);
  React.useEffect(() => {
    if (!queryRef) {
      return loadQuery({ queryString: "" }, { fetchPolicy: "network-only" });
    }
  }, [loadQuery, queryRef]);
  if (!queryRef) {
    return null;
  }
  return (
    <React.Suspense fallback={<ScreenCenterSpinner />}>
      <SearchRestaurantContainer queryRef={queryRef} />
    </React.Suspense>
  );
};
