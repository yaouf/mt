import { createStackNavigator } from "@react-navigation/stack";
import { NavProp, SearchStackProps } from "src/types/navStacks";
import ArticleScreen from "../article/ArticleScreen";
import FiltersScreen from "./FiltersScreen";
import SearchScreen from "./SearchScreen";

const SearchStack = createStackNavigator<SearchStackProps>();

function SearchStackScreen({navigation, route} : NavProp) {
  const { isDarkMode, toggleTheme } = route.params || {};
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
        initialParams={{ isDarkMode, toggleTheme }}
      />
      <SearchStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="FiltersScreen"
        component={FiltersScreen}
        options={{ headerShown: false, title: "Filters" }}
      />
    </SearchStack.Navigator>
  );
}

export default SearchStackScreen;
