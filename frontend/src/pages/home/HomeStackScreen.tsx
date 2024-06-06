import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import { HomeStackProps } from "src/types/types";
import ArticleScreen from "../article/ArticleScreen";
import SectionsScreen from "../sections/SectionsScreen";

const HomeStack = createStackNavigator<HomeStackProps>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Section"
        component={SectionsScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
