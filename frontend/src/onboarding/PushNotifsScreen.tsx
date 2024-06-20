import {
  Linking,
  Alert,
  View,
  Text,
  Switch,
  Platform,
  Button,
  TouchableOpacity,
} from "react-native";
import { PushNotifProps } from "../types/types";

import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";
import { getPushToken } from "../code/pushNotifs";
import { settings } from "src/styles/pages";
import { API_KEY, API_URL } from "@env";
import { useState, useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { baseStyles, text } from "src/styles/styles";
import Notif from "src/components/Notif";

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

function PushNotifsScreen(props: PushNotifProps) {
  const [breakingNotifs, setBreakingNotifs] = useState<boolean>(true); // default to true, user can change
  const [weeklyNotifs, setWeeklyNotifs] = useState<boolean>(true);
  const [pushToken, setPushToken] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifPermission, setNotifPermission] = useState<string | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);

  // useEffect(() => {
  //   checkNotificationPermission();
  // }, []);

  console.log("push notif screen");

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    console.log("Notification Permission:", status);
    setNotifPermission(status);
    setAsync("notifPermission", status); // Store the permission status in AsyncStorage

    if (status === "undetermined" && !hasRegistered) {
      Alert.alert(
        "Allow Notifications",
        "Would you like to receive notifications for important news and updates?",
        [
          {
            text: "Don't Allow",
            onPress: () => {
              console.log("Permission denied");
              setAsync("notifPermission", "denied"); // Update AsyncStorage immediately upon denial
            },
            style: "cancel",
          },
          { text: "Allow", onPress: requestNotificationPermission },
        ],
        { cancelable: false }
      );
    } else if (status === "granted") {
      await registerForPushNotificationsAsync();
      setHasRegistered(true);
    }
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifPermission(status);
    setAsync("notifPermission", status); // Update AsyncStorage with the new status

    if (status === "granted") {
      console.log("Notification permission granted.");
      await registerForPushNotificationsAsync();
      setHasRegistered(true);
    } else {
      console.log("Notification permission denied.");
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  /**
   * Requests permission to send push notifications
   */
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Makes sure the code is running on an actual device
    if (Device.isDevice) {
      // Gets the current device's permission status in its settings
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      // Request for permission if it hasn't been granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "51f97ce3-1a0c-4159-abc3-4b04e2e1db8b",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  /**
   * Constructs JSON Body that contains device info and push token to send a POST
   * request to APi endpoint
   */
  const createDevice = async () => {
    const body = JSON.stringify({
      deviceType: Platform.OS,
      breakingNewsAlerts: breakingNotifs,
      weeklySummaryAlerts: weeklyNotifs,
      expoPushToken: expoPushToken,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: body,
      redirect: "follow",
    };

    fetch(API_URL + "/createDevice", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log("!!!!!", result))
      .catch((error) => console.error(error));
  };

  /**
   * Saves user's notification preferences for breaking news and weekly summary alerts.
   * Also retrieves push token by using getPushToken and creates a device using createDevice
   */
  const saveNotifPreferences = async () => {
    setAsync("breakingNotifs", JSON.stringify(breakingNotifs));
    setAsync("weeklyNotifs", JSON.stringify(weeklyNotifs));

    await getPushToken(setPushToken);
    console.log("token", pushToken);

    await createDevice();
    await checkNotificationPermission();

    props.navigation.push("Done");
  };

  /**
   * Constructs push notif payload containing the taget expoPushToken/title/body, and sends it to
   * Expo push notification service using fetch network request. This services uses the token we provide to deliver
   * the notification to the specific device registered.
   */
  const sendNotification = async () => {
    console.log("Sending push notification...");
    // notification message
    const message = {
      to: expoPushToken,
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
      console.error("Error sending push notification:", error.message);
    }
  };

  return (
    <View style={baseStyles.container}>
      <Button
        title="Request Notification Permission"
        onPress={requestNotificationPermission}
      ></Button>
      <Text style={text.bigTitle}>Welcome.</Text>
      <Text style={text.normal}>
        Turn on alerts for the topics that interest you and we'll keep you
        updated.
      </Text>
      <View style={{ rowGap: 16 }}>
        <Notif
          title="Breaking News"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
        />
        <Notif
          title="Weekly Summary"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
        />
      </View>
      <TouchableOpacity
        style={settings.continueButton}
        onPress={saveNotifPreferences}
      >
        <Text style={text.sectionHeader1}>Save and continue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[settings.continueButton, { borderColor: "white" }]}
        onPress={() => props.navigation.push("Done")}
      >
        <Text style={text.normal}>No, thanks</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PushNotifsScreen;
