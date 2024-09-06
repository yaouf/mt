import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import { Dispatch, SetStateAction } from "react";
import { Text } from "react-native";
import { fetchArticle } from "src/code/fetchContent";
import { Article } from "src/types/data";

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
    console.log("use effect notif handler running");
    const notificationListener = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log("notif listener");
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
        console.log("url ", notification.notification.request.content.data.url);
        
        handleLinkPress(null, notification.notification.request.content.data.url, setArticle)

      }
    );
    
    // Returning cleanup function for removing listeners
    return () => {
      notificationListener.remove();
    };
  }, []);

  return (<Text>Hello</Text>);
}

export default NotificationHandler;
