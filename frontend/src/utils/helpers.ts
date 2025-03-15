import { trackEvent } from "@aptabase/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";
import { SavedArticleDict } from "src/pages/MainTabNavigator";

/**
 * sets an item in Async storage to the given value
 * @param key the key name of the item in Async storage
 * @param value the value to set that item to
 */
export async function setAsync(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
}

/**
 * gets the key from Async storage
 * @param key the key name of the item in Async storage
 * @returns the stored value as a string, or null if it doesn't exist
 */
export async function getAsync(key: string) {
  try {
    const storedItem = await AsyncStorage.getItem(key);
    return storedItem;
  } catch (error) {
    console.error("Error loading data: ", error, "for key: ", key);
    return null;
  }
}

/**
 * removes the key from Async storage
 * @param key the key name of the item in Async storage
 */
export async function removeAsync(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(err);
  }
}

/**
 * for use in bottom bar of articles and show context menu of cards (...)
 */
export function handleBookmark(
  saved: boolean,
  slug: string,
  date: string,
  uuid: string,
  savedArticles: SavedArticleDict,
  setSavedArticles: Dispatch<SetStateAction<SavedArticleDict>>,
  setSaved: Dispatch<SetStateAction<boolean>>
) {
  // update in saved context
  if (!saved) {
    console.log("saving");
    // not currently saved, so save now
    const newSaved = { slug: slug, date: date };
    savedArticles[uuid] = newSaved;
    trackEvent("savedarticle", { uuid });
  } else {
    console.log("removing");

    delete savedArticles[uuid];
  }

  setSavedArticles({ ...savedArticles });

  // update in async storage
  setAsync("savedArticles", JSON.stringify(savedArticles)).then(() =>
    setSaved((prev) => !prev)
  );
}

/**
 * TODO: example for now
 * Constructs push notif payload containing the taget expoPushToken/title/body, and sends it to
 * Expo push notification service using fetch network request. This services uses the token we provide to deliver
 * the notification to the specific device registered.
 */
export const sendNotification = async () => {
  console.log("Sending push notification...");
  // notification message
  const message = {
    to: "ExponentPushToken[rhP2mkHhzPOAVEC9k9rWka]",
    sound: "default",
    title: "My first push notif!",
    body: "This is my first push notif",
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      console.log("Push notification sent successfully!");
    } else {
      console.error("Failed to send push notification:", response.statusText);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending push notification:", error.message);
    }
  }
};
