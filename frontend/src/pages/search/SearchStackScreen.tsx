import { createStackNavigator } from "@react-navigation/stack";
import { SearchStackProps } from "src/types/navStacks";
import SearchScreen from "./SearchScreen";
import ArticleScreen from "../article/ArticleScreen";

const SearchStack = createStackNavigator<SearchStackProps>();

function SearchStackSCreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen name="Article" component={ArticleScreen} />
    </SearchStack.Navigator>
  );
}

export default SearchStackSCreen;
