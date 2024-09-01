import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { font2 } from "src/styles/styles";
import Header from "src/components/Header";
import HomeStackScreen from "./home/HomeStackScreen";
import SettingsStackScreen from "./settings/SettingsStackScreen";
import SearchStackScreen from "./search/SearchStackScreen";
import { NotificationProvider } from "./settings/NotificationProvider";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAsync } from "src/code/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HoldMenuProvider } from "react-native-hold-menu";
import * as Notifications from "expo-notifications";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export type SavedArticleDict = {
  [uuid: string]: { slug: string; date: string };
};

export type SavedContextType = {
  savedArticles: SavedArticleDict;
  setSavedArticles: Dispatch<SetStateAction<Object>>;
};

export const SavedContext = createContext<SavedContextType>({
  savedArticles: {},
  setSavedArticles: () => {}, // Dummy function
});

/**
 * Defines how notifications should behave when received by the app
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * @returns Main screens of the app
 */
export default function Nav() {
  const [savedArticles, setSavedArticles] = useState<Object>({});
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await getAsync("savedArticles");
        if (!saved) {
          setSavedArticles({});
        } else {
          setSavedArticles(saved);
        }

        await AsyncStorage.getAllKeys().then((resp) =>
          console.log("**!!", resp)
        );
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  console.log(
    "Title",
    notification && notification.request.content.title,
    "Body",
    notification && notification.request.content.body,
    "Data",
    notification && JSON.stringify(notification.request.content.data)
  );

  return (
    <HoldMenuProvider safeAreaInsets={{ top: 0, bottom: 0, right: 0, left: 0 }}>
      <NotificationProvider>
        <SavedContext.Provider value={{ savedArticles, setSavedArticles }}>
          <Tab.Navigator
            screenOptions={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

              return {
                tabBarIcon: ({ color }) => {
                  let iconName = "home-outline";

                  if (route.name === "Settings") {
                    iconName = "settings-outline";
                  } else if (route.name === "Search") {
                    iconName = "search-outline";
                  } else if (route.name === "For You") {
                    iconName = "star-outline";
                  }

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
                  display: routeName === "Article" ? "none" : "flex",
                },
                tabBarLabelStyle: {
                  fontFamily: font2,
                  fontSize: 10,
                },
                headerShown: routeName === "Article" ? false : true,
              };
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                headerTitle: () => <Header />,
                headerStyle: {},
                headerShadowVisible: false, 
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchStackScreen}
              options={{ headerTitle: () => <Header /> }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsStackScreen}
              options={{ headerTitle: () => <Header /> }}
            />
          </Tab.Navigator>
        </SavedContext.Provider>
      </NotificationProvider>
    </HoldMenuProvider>
  );
}
