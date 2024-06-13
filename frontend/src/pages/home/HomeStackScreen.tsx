import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import { HomeStackProps } from "src/types/types";
import ArticleScreen from "../article/ArticleScreen";
import SectionsScreen from "../sections/SectionsScreen";
import HorizontalScrollMenu from "./menu/HorizontalScrollMenu";
import Staff from "../staff/Staff";

const HomeStack = createStackNavigator<HomeStackProps>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        header: HorizontalScrollMenu,
        headerStyle: {
          height: 20,
        },
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <HomeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Section"
        component={SectionsScreen}
        options={{ headerShown: true }}
      />
      <HomeStack.Screen
        name="Staff"
        component={Staff}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
