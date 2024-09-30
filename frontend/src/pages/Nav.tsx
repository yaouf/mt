import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HoldMenuProvider } from "react-native-hold-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchArticle } from "src/code/fetchContent";
import { getAsync } from "src/code/helpers";
import Header from "src/components/Header";
import { Article } from "src/types/data";
import HomeStackScreen from "./home/HomeStackScreen";
import SearchStackScreen from "./search/SearchStackScreen";
import { NotificationProvider } from "./settings/NotificationProvider";
import SettingsStackScreen from "./settings/SettingsStackScreen";

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

  const navigation = useNavigation();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        console.log(response);

        const setArticle = (article: Article) => {
          // navigation.navigate("Article", {data: article});
        }
        // navigate to the article page
        const slug = response.notification.request.content.data.slug;
        const date = response.notification.request.content.data.date;
        const fetchedArticle = await fetchArticle(slug, date, setArticle);
        navigation.navigate("Article", {data: fetchedArticle});

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
    <SafeAreaView style={{flex: 1, paddingTop: 0, marginTop: 0}} edges={["bottom", "left", "right"]}>
    <HoldMenuProvider safeAreaInsets={{ top: 0, bottom: 0, right: 0, left: 0 }}>
      <NotificationProvider>
        <SavedContext.Provider value={{ savedArticles, setSavedArticles }}>
          <Tab.Navigator
            screenOptions={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

              return {
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  let label;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home-sharp' : 'home-outline';
                    label = 'Home';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings-sharp' : 'settings-outline';
                    label = 'Settings';
                  } else if (route.name === 'Search') {
                    iconName = focused ? 'search-sharp' : 'search-outline';
                    label = 'Search';
                  } else if (route.name === 'For You') {
                    iconName = focused ? 'star-sharp' : 'star-outline';
                    label = 'For You';
                  }

                  return (
                    <Ionicons 
                      name={iconName} 
                      size={size + 4} // Increase icon size slightly
                      color={color} 
                      accessibilityLabel={label}
                    />
                  );
                },
                tabBarActiveTintColor: "#ED1C24",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                  height: 60,
                  marginBottom: 0,
                  paddingTop: 2, 
                  paddingBottom: 2, 
                  paddingRight: 20,
                  paddingLeft: 20,
                  display: routeName === "Article" ? "none" : "flex",
                },
                tabBarShowLabel: false,
                headerShown: routeName === "Article" ? false : true,
              };
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                headerTitle: () => <Header />,
                // headerStyle: {},
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
    </SafeAreaView>
  );
}
