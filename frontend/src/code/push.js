import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;
  console.log("registerForPushNotificationsAsync called");
  if (Device.isDevice) {
    console.log("Device is a device");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "51f97ce3-1a0c-4159-abc3-4b04e2e1db8b",
      })
    ).data;
    console.log(token);
  } else {
    console.log("Device is not a device");

    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hello!",
      body: "This notification was scheduled on app load.",
    },
    trigger: { seconds: 1 }, // Schedules the notification to be shown in 10 seconds
  });
}
