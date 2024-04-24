import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./home/HomeScreen";
import ForYouScreen from "./foryou/ForYouScreen";
import SettingsScreen from "./settings/SettingsScreen";
import TestArticleScreen from "./TestArticleScreen";
import SearchScreen from "./search/SearchScreen";

import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { font2 } from "src/styles/styles";
import Header from "src/components/Header";
import HomeStackScreen from "./home/HomeStackScreen";
import ForYouStackScreen from "./foryou/ForYouStackScreen";

const Tab = createBottomTabNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFF",
  },
};

/**
 * @returns Main app component
 */
export default function Nav() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName = "home-outline";

            if (route.name === "Settings") {
              iconName = "settings-outline";
            } else if (route.name === "Search") {
              iconName = "search-outline";
            } else if (route.name === "For You") {
              iconName = "star-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: "#ED1C24",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 65,
            marginBottom: 30,
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 20,
            paddingLeft: 20,
          },
          tabBarLabelStyle: {
            // padding: 5,
            fontFamily: font2,
            fontSize: 10,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            headerTitle: () => <Header />,
            headerStyle: {
              // paddingBottom: 8,
            },
          }}
        />
        <Tab.Screen
          name="For You"
          component={ForYouStackScreen}
          options={{ headerTitle: () => <Header /> }}
        />
        {/* <Tab.Screen name="ArticleScreen" component={TestArticleScreen} /> */}
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerTitle: () => <Header /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
