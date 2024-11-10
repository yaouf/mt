import { trackEvent } from "@aptabase/react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
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
import { fetchArticle } from "src/api/fetchContent";
import Header from "src/components/Header";
import { Article } from "src/types/data";
import { getAsync } from "src/utils/helpers";
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
 * Parses a URL and extracts the domain, mediaType, publicationDate, and slug.
 * Handles both cases where isUid is true or false.
 *
 * @param url - The URL to parse.
 * @param isUid - Boolean indicating if the URL contains a UID.
 * @returns An object containing the extracted parts.
 */
export function parseArticleUrl(url: string, isUid: boolean) {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (isUid) {
      // Assuming the UID is the last segment in the URL
      const uid = pathSegments.pop();
      return {
        domain: parsedUrl.origin,
        uid,
      };
    } else {
      // Assuming the format is <domain>/<mediatype>/<year>/<month>/<slug>
      const slug = pathSegments.pop();
      const month = pathSegments.pop();
      const year = pathSegments.pop();
      const mediaType = pathSegments.shift();

      const publicationDate = `${year}-${month}`;

      return {
        domain: parsedUrl.origin,
        mediaType,
        publicationDate,
        slug,
      };
    }
  } catch (error) {
    console.error("tried parsing article with", url, "and isUid", isUid);
    console.error("Error parsing URL:", error);
    return null;
  }
}

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
 * @returns Main screens of the app accessible from the bottom tab navigator
 */
export default function BottomNavigator() {
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

  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const listener = async () => {
      if (response) {
        console.log(response);
        console.log("response in listener", response);

        const setArticle = async (article: Article) => {
          // navigation.navigate("Article", {data: article});
        };

        const parsedArticle = parseArticleUrl(
          response.notification.request.content.data.url,
          response.notification.request.content.data.isUid
        );

        if (parsedArticle?.slug && parsedArticle?.publicationDate) {
          console.log("parsedArticle", parsedArticle);
          const fetchedArticle = await fetchArticle(
            parsedArticle.slug,
            parsedArticle.publicationDate,
            setArticle
          );
          navigation.navigate("Article", { data: fetchedArticle });
          trackEvent("notification_clicked", {
            action: response.actionIdentifier,
            slug: parsedArticle.slug,
            date: parsedArticle.publicationDate,
          });
        } else {
          console.log(
            "Notification data does not contain a valid slug or publication date"
          );
          // TODO: handle UUID case
        }
      }
    };

    listener();
  }, [response]);

  console.log(
    "Title",
    notification && notification.request.content.title,
    "Body",
    notification && notification.request.content.body,
    "Data",
    notification && JSON.stringify(notification.request.content.data)
  );

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: 0, marginTop: 0 }}
      edges={["bottom", "left", "right"]}
    >
      <HoldMenuProvider
        safeAreaInsets={{ top: 0, bottom: 0, right: 0, left: 0 }}
      >
        <NotificationProvider>
          <SavedContext.Provider value={{ savedArticles, setSavedArticles }}>
            <Tab.Navigator
              screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

                return {
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let label;

                    if (route.name === "Home") {
                      iconName = focused ? "home-sharp" : "home-outline";
                      label = "Home";
                    } else if (route.name === "Settings") {
                      iconName = focused
                        ? "settings-sharp"
                        : "settings-outline";
                      label = "Settings";
                    } else if (route.name === "Search") {
                      iconName = focused ? "search-sharp" : "search-outline";
                      label = "Search";
                    } else if (route.name === "For You") {
                      iconName = focused ? "star-sharp" : "star-outline";
                      label = "For You";
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
                  headerShown: routeName === "Article" ? false : true, // TODO: simplify this logic with !== "Article"
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
