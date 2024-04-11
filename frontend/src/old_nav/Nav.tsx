import { useEffect } from "react";
import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SectionsScreen from "./pages/SectionsScreen";
import SettingsScreen from "./pages/SettingsScreen";

import { NavProps, UserProps } from "../types/types";
import HomeStackScreen from "./pages/HomeStackScreen";

const Tab = createBottomTabNavigator<NavProps>();

/**
 * @returns Main app component
 */
export default function Nav(userProps: UserProps) {
  console.log("Here in nav");
  console.log(userProps);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="HomePage"
          component={HomeStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Sections" component={SectionsScreen} />
        <Tab.Screen
          name="Settings"
          children={() => <SettingsScreen {...userProps} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
