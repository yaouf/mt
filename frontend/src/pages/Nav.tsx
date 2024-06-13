import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./settings/SettingsScreen";
import SearchScreen from "./search/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { font2 } from "src/styles/styles";
import Header from "src/components/Header";
import HomeStackScreen from "./home/HomeStackScreen";
import ForYouStackScreen from "./foryou/ForYouStackScreen";
import { NotificationProvider } from "./settings/NotificationProvider";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { getAsync, removeAsync } from "src/code/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFF",
  },
};

export type SavedContextType = {
  savedArticles: Object;
  setSavedArticles: Dispatch<SetStateAction<Object>>;
};

export const SavedContext = createContext<SavedContextType>({
  savedArticles: {},
  setSavedArticles: () => {}, // Dummy function
});

/**
 * @returns Main screens of the app
 */
export default function Nav() {
  const [savedArticles, setSavedArticles] = useState<Object>({});

  const load = async () => {
    try {
      const saved = await getAsync("savedArticles");
      setSavedArticles(saved);
      await AsyncStorage.getAllKeys().then((resp) => console.log("**!!", resp));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <NotificationProvider>
      <SavedContext.Provider value={{ savedArticles, setSavedArticles }}>
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
      </SavedContext.Provider>
    </NotificationProvider>
  );
}
