import React, { createContext, useState, useContext, useEffect } from "react";
import { Linking, Alert, Platform, AppState } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/**
 * Shared NotificationContext for Settings and Onboarding page:
 * - Important for knowing push notif enabled within both the app context and device settings context
 */
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // State for managing the app's notification setting within the app
  const [appNotificationEnabled, setAppNotificationEnabled] = useState(false);
  // State for managing the actual system permission status
  const [systemPermissionStatus, setSystemPermissionStatus] =
    useState("undetermined");
  // State to store the Expo push token
  const [expoPushToken, setExpoPushToken] = useState("");

  // On app startup, check the permissions of the systems settings and the internal app settings
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setSystemPermissionStatus(status);
    setAppNotificationEnabled(status === "granted");
  };

  // Function to register for push notifications
  // - If permission is granted, then it fetches Expo push token used for sending notifs
  const registerForPushNotificationsAsync = async () => {
    // Special setup for Android: Ensure that the notification channel is created
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Requesting permissions and handling the response
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        // Optionally send token to your backend server here
        setAppNotificationEnabled(true);
        setSystemPermissionStatus("granted");
      } else {
        alert("Failed to get push token for push notification!");
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };

  const toggleNotifications = async (value) => {
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      // Update the systemPermissionStatus state based on the current system permission
      setSystemPermissionStatus(status);

      if (status === "granted") {
        // If the system permission status is granted, then we enable the app notifications
        console.log("Enabling notifications...");
        setAppNotificationEnabled(true);
        if (!expoPushToken) {
          // If we don't have the push token yet, call the function to register for push notifications
          await registerForPushNotificationsAsync();
        }
        Alert.alert(
          "Enable Notifications",
          "To enable notifications, please go to Settings and turn on notifications for this app.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Permission denied"),
              style: "cancel",
            },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        console.log(
          "Status is granted, but still sent to settings for user to manually check notifications on"
        );
      } else if (status === "denied") {
        // If the system permission status is denied, we direct the user to the settings
        Alert.alert(
          "Enable Notifications",
          "To enable notifications, please go to Settings and turn on notifications for this app.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Permission denied"),
              style: "cancel",
            },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        console.log(
          "Permissions denied, so sent user to settings to manually turn notifs on!"
        );
      }
    } else {
      // If the user is toggling notifications off, update the state to reflect that
      console.log("Disabling notifications!");
      setAppNotificationEnabled(false);
    }
  };

  // Everytime toggle succesfully changes
  useEffect(() => {
    // This will log the updated state after the component re-renders.
    console.log("current appNotifEnabled", appNotificationEnabled);
  }, [appNotificationEnabled]); // This tells React to run the effect after any change to appNotificationEnabled

  // Makes sure that when the user is sent to settings page, the permissions are properly reflected
  // User may decide in their settings not to allow, so this app must also reflect that
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground, check if the permissions have changed
        const { status } = await Notifications.getPermissionsAsync();
        setSystemPermissionStatus(status); // Update the systemPermissionStatus state
        setAppNotificationEnabled(status === "granted"); // Update appNotificationEnabled based on the new status
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    // Initial permission check
    checkPermissions();

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  // Effect to check permissions when the app loads
  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        appNotificationEnabled,
        systemPermissionStatus,
        expoPushToken,
        toggleNotifications,
        checkPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
