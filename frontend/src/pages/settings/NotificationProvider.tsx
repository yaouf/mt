import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Platform, AppState } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { setAsync } from "src/code/helpers";

interface NotificationContextType {
  systemPermissionStatus: string;
  setSystemPermissionStatus: Dispatch<SetStateAction<string>>;
  checkPermissions: () => void;
  requestPermission: () => Promise<string>;
  breaking: boolean;
  setBreaking: Dispatch<SetStateAction<boolean>>;
  weekly: boolean;
  setWeekly: Dispatch<SetStateAction<boolean>>;
  daily: boolean;
  setDaily: Dispatch<SetStateAction<boolean>>;
  deviceID: string;
  setDeviceID: Dispatch<SetStateAction<string>>;
}

/**
 * Shared NotificationContext for Settings and Onboarding page:
 * - Important for knowing push notif enabled within both the app context and device settings context
 */

// these are just defaults in case the child can't find a provider parent
export const NotificationContext = createContext<NotificationContextType>({
  systemPermissionStatus: "undetermined",
  setSystemPermissionStatus: () => {},
  checkPermissions: () => {},
  requestPermission: async () => {
    return "";
  },
  breaking: true,
  setBreaking: () => {},
  weekly: true,
  setWeekly: () => {},
  daily: true,
  setDaily: () => {},
  deviceID: "",
  setDeviceID: () => {},
});

export const NotificationProvider = ({ children }) => {
  // State for managing the actual system permission status
  const [systemPermissionStatus, setSystemPermissionStatus] =
    useState("undetermined");

  // notifications
  const [weekly, setWeekly] = useState(true);
  const [daily, setDaily] = useState(true);
  const [breaking, setBreaking] = useState(true);

  // device id & push token
  const [deviceID, setDeviceID] = useState("");

  // On app startup, check the permissions of the systems settings and the internal app settings
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setSystemPermissionStatus(status);
  };

  // Function to register for push notifications
  const requestPermission = async (): Promise<string> => {
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
      setSystemPermissionStatus(status);
      setAsync("systemPermissionStatus", systemPermissionStatus);
      return status;
    } else {
      console.log("Must use physical device for Push Notifications");
      return "error";
    }
  };

  // useEffect(() => {
  //   const handleAppStateChange = async (nextAppState) => {
  //     if (nextAppState === "active") {
  //       const { status } = await Notifications.getPermissionsAsync();
  //       setSystemPermissionStatus(status);
  //       console.log("App has come to the foreground");
  //     }
  //   };

  //   AppState.addEventListener("change", handleAppStateChange);

  //   checkPermissions(); // Initial permission check

  //   return () => {
  //     AppState.removeEventListener("change", handleAppStateChange);
  //   };
  // }, []);
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      console.log(`AppState changed to: ${nextAppState}`);

      if (nextAppState === "active") {
        console.log("App has come to the foreground");

        // Check for any notifications received while the app was in the background
        const lastNotificationResponse =
          await Notifications.getLastNotificationResponseAsync();
        if (lastNotificationResponse) {
          console.log(
            "Handled notification when app came to foreground:",
            lastNotificationResponse
          );
          // Handle the last notification response here (e.g., navigate to a screen)
        }
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  // Effect to check permissions when the app loads
  useEffect(() => {
    console.log("checking permissions use effect notif provider");
    checkPermissions();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        systemPermissionStatus,
        setSystemPermissionStatus,
        checkPermissions,
        requestPermission,
        breaking,
        setBreaking,
        weekly,
        setWeekly,
        daily,
        setDaily,
        deviceID,
        setDeviceID,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
