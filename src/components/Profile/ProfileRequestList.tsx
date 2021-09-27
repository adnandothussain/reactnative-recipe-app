import * as React from "react";
import { View, StyleSheet, FlatList, ListRenderItemInfo } from "react-native";
import { graphql, usePaginationFragment } from "react-relay";
import { ProfileRequestItem_recipeRequest$key } from "src/services/graphql/__generated__/ProfileRequestItem_recipeRequest.graphql";
import { ProfileRequestListQuery } from "src/services/graphql/__generated__/ProfileRequestListQuery.graphql";
import { ProfileRequestList_recipeRequests$key } from "src/services/graphql/__generated__/ProfileRequestList_recipeRequests.graphql";
import ProfileRequestItem from "./ProfileRequestItem";
import RecipeRequestModalCard from "./RecipeRequestModalCard";

interface ProfileRequestListProps {
  requestsRef: ProfileRequestList_recipeRequests$key;
}

const requestsFragment = graphql`
  fragment ProfileRequestList_recipeRequests on User
  @refetchable(queryName: "ProfileRequestListQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
  ) {
    recipeRequests(first: $count, after: $cursor)
      @connection(key: "ProfileRequestListPagination_recipeRequests") {
      edges {
        node {
          _id
          ...ProfileRequestItem_recipeRequest
        }
      }
    }
  }
`;

const ProfileRequestList: React.FC<ProfileRequestListProps> = ({
  requestsRef,
}) => {
  const { data } = usePaginationFragment<
    ProfileRequestListQuery,
    ProfileRequestList_recipeRequests$key
  >(requestsFragment, requestsRef);

  const requests = React.useMemo(
    () => data.recipeRequests?.edges ?? [],
    [data]
  );

  const renderItem = React.useCallback(
    ({
      item: { node },
    }: ListRenderItemInfo<{ node: ProfileRequestItem_recipeRequest$key }>) => (
      <ProfileRequestItem requestRef={node} />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={RecipeRequestModalCard}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProfileRequestList;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainerStyle: { paddingHorizontal: 10 },
});
