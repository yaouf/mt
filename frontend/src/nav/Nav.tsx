import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React from "react";
import SettingsScreen from "./pages/SettingsScreen";

import { NavProps, UserProps } from "../types/types";
import HomeStackScreen from "./pages/HomeStackScreen";
import ForYouSreen from "./pages/ForYouScreen";
import ArticleScreen from "./pages/ArticleScreen";
import TestArticleScreen from "./pages/TestArticle";

const Tab = createBottomTabNavigator<NavProps>();

/**
 * @returns Main app component
 */
export default function Nav() {
  console.log("Here in nav");

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomePage" component={HomeStackScreen} />
        <Tab.Screen name="ForYouPage" component={ForYouSreen} />
        <Tab.Screen name="ArticleScreen" component={TestArticleScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
