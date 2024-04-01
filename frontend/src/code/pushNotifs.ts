import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Dispatch, SetStateAction } from "react";

/**
 * get the push token from a device, store in the pushToken state of UserProps
 * @param setToken set state function that sets the user's push token
 */
export const getPushToken = async (
  setToken: Dispatch<SetStateAction<string>>
) => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setToken(token);
        // sendTokenToBackend(token);
      } else {
        // Permission not granted, handle accordingly TODO:
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  }
};
