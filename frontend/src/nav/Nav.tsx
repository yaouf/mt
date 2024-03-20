import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SectionsScreen from "./pages/SectionsScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingsScreen from "./pages/SettingsScreen";

import { registerForPushNotificationsAsync } from "../code/push";
import { NavProps, UserProps } from "../types";
import HomeStackScreen from "./pages/HomeStackScreen";

const Tab = createBottomTabNavigator<NavProps>();

/**
 * @returns Main app component
 */
export default function Nav(userProps: UserProps) {
  const checkVisited = async () => {
    const visited = await AsyncStorage.getItem("hasVisited");
    if (visited) userProps.setHasOnboarded(true);
  };

  console.log("Here in nav");

  useEffect(() => {
    registerForPushNotificationsAsync();
    checkVisited();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="HomePage"
          component={HomeStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Sections" component={SectionsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Settings"
          children={() => <SettingsScreen {...userProps} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
