import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import ArticleComponent from "../article/ArticleScreen";
import { HomeStackProps } from "src/types/types";

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
        component={ArticleComponent}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
