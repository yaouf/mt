import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavProps, UserProps } from "../types/types";
import HomeScreen from "./home/HomeScreen";
import ForYouScreen from "./foryou/ForYouScreen";
import SettingsScreen from "./settings/SettingsScreen";
import TestArticleScreen from "./TestArticleScreen";

const Tab = createBottomTabNavigator<NavProps>();

/**
 * @returns Main app component
 */
export default function Nav() {
  console.log("Here in nav");

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomePage" component={HomeScreen} />
        <Tab.Screen name="ForYouPage" component={ForYouScreen} />
        <Tab.Screen name="ArticleScreen" component={TestArticleScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
