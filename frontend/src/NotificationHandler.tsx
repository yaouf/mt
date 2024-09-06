import React, { useEffect, useState, useRef } from "react";
import { View, Animated } from "react-native";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationProvider } from "./pages/settings/NotificationProvider";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";



import { Image, Text, Linking } from "react-native";
import { articleStyles } from "src/styles/article";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Article } from "src/types/data";
import { Dispatch, SetStateAction } from "react";
import { fetchArticle } from "src/code/fetchContent";
import WebView from "react-native-webview";
import * as WebBrowser from "expo-web-browser";

const linking = {
  prefixes: ['com.browndailyherald.thebrowndailyherald"://', 'https://browndailyherald.com'],  // custom app scheme and web domain
  config: {
    screens: {
      HomeScreen: 'home',
      Article: 'article/:slug',  // handles the article slug from deep link
    },
  },
};


function NotificationHandler() {

  const navigation = useNavigation<StackNavigationProp<any>>();
  const [article, setArticle] = useState<Article | undefined>();

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const handleLinkPress = async (
          event: any,
          href: string,
          setArticle: Dispatch<SetStateAction<Article | undefined>>
        ) => {
          // checks if url is article
          const articleBaseURL = "https://www.browndailyherald.com/article/";
          if (href.startsWith(articleBaseURL)) {
            try {
              // fetch article data
              const seg = href.split("/"); // splits href into slug and date
    
              const slug = seg.pop(); // retrieves slug
    
              const month = seg.pop(); // retrieves date month
              const year = seg.pop(); //retrieves date year
              const date = year + "-" + month;
    
              // check if slug, year, or month is invalid
              if (!slug || !year || !month) {
                throw new Error("Invalid URL format");
              }
    
              const fetchedArticle = await fetchArticle(slug, date, setArticle);
              setArticle(fetchedArticle);
              // navigate to Article screen with fetched article data
              console.log(slug);
              navigation.push("Article", { data: fetchedArticle });
            } catch (error) {
              // handle article error
              console.error("Error fetching article:", error);
            }
          }
          // opens url in web browser if not article
          else {
            await WebBrowser.openBrowserAsync(href);
          }
        };

        console.log("url ", notification.request.content.data.url);
        
        handleLinkPress(null, notification.request.content.data.url, setArticle)

      }
    );

    // Returning cleanup function for removing listeners
    return () => {
      notificationListener.remove();
    };
  }, []);

  return (null);
}

export default NotificationHandler;
