import * as React from "react";
import { SafeAreaView, View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { atom, useRecoilState } from "recoil";

import RecipeList from "src/components/RecipeList";

import SearchInput from "src/components/SearchInput/SearchInput";
import { COLORS } from "src/constants/colors";
import { SearchRecipes } from "src/features/Search/SearchRecipes";
import { moderateScale } from "src/utils/scale";
import { styles } from "./style";

export const searchRecipesAtom = atom({
  key: "searchScreenQuery",
  default: {
    type: "Recipe" || "Restaurant",
    query: "",
  },
});

const SearchScreen: React.FC = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "Recipe", title: "Recipe" },
    { key: "Restaurant", title: "Restaurant" },
  ]);
  const [searchQuery, setSearchQuery] = useRecoilState(searchRecipesAtom);

  const Restaurant = React.useCallback(
    () => <RecipeList title="Restaurants nearby" />,
    []
  );

  const handleSetSearch = React.useCallback(
    (text: string) => {
      setSearchQuery((prev) => ({ ...prev, query: text }));
    },
    [setSearchQuery]
  );

  const renderScene = React.useMemo(
    () =>
      SceneMap({
        Recipe: SearchRecipes,
        Restaurant,
      }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <SearchInput value={searchQuery} onChange={handleSetSearch} />
        <TabView
          style={{ marginTop: moderateScale(10) }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorContainerStyle={styles.indicatorContainer}
              inactiveColor={COLORS.textGrey}
              activeColor={COLORS.primaryRed}
              labelStyle={styles.indicatorLabel}
              indicatorStyle={styles.indicator}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
