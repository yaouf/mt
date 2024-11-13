import { createStackNavigator } from "@react-navigation/stack";
import { SearchStackProps } from "src/types/navStacks";
import SearchScreen from "./SearchScreen";
import ArticleScreen from "../article/ArticleScreen";
import FilterDrawer from "./FilterDrawer";

const SearchStack = createStackNavigator<SearchStackProps>();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="FilterScreen"
        component={FilterDrawer}
        options={{
          headerShown: false,
          presentation: "transparentModal",
          headerTitle: "Filter Options",
        }}
      />
    </SearchStack.Navigator>
  );
}

export default SearchStackScreen;
