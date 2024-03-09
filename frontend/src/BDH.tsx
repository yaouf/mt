import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./pages/HomeScreen";
import SectionsScreen from "./pages/SectionsScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingsScreen from "./pages/SettingsScreen";
import ArticleScreen from "./components/Article";
import LoginScreen from "./pages/LoginScreen";

import { registerForPushNotificationsAsync } from "./code/push";
import { NavProps, LoginProps, YourParamListType } from "./types";

const HomeStack = createStackNavigator<YourParamListType>();
const Tab = createBottomTabNavigator<NavProps>();

const horizontalTransition = ({ current, layouts }: any) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  return { cardStyle: { transform: [{ translateX }] } };
};

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Article"
      component={ArticleScreen}
      options={{ cardStyleInterpolator: horizontalTransition }}
    />
  </HomeStack.Navigator>
);

/**
 * @returns Main app component
 */
export default function BDH() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<string>("");

  const userProps: LoginProps = {
    loggedIn: loggedIn,
    setLoggedIn: setLoggedIn,
    username: username,
    setUsername: setUsername,
    community: community,
    setCommunity: setCommunity,
  };

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
          // component={<SettingsScreen {...userProps} />}
          children={() => <SettingsScreen {...userProps} />}
        />
        <Tab.Screen
          name="Login"
          children={() => <LoginScreen {...userProps} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
