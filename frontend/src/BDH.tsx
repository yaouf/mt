import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { registerForPushNotificationsAsync } from "./code/push";
import HomeScreen from "./pages/HomeScreen";
import SectionsScreen from "./pages/SectionsScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingsScreen from "./pages/SettingsScreen";
import LoginScreen from "./pages/LoginScreen";

const Tab = createBottomTabNavigator();

/**
 * @returns Main app component
 */
export default function BDH() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Sections" component={SectionsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
