import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, Platform, AppStateStatus } from "react-native";
import { setAsync } from "src/code/helpers";

interface NotificationContextType {
  systemPermissionStatus: string;
  setSystemPermissionStatus: Dispatch<SetStateAction<string>>;
  checkPermissions: () => void;
  requestPermission: () => Promise<string>;
  breaking: boolean;
  setBreaking: Dispatch<SetStateAction<boolean>>;
  universityNews: boolean;
  setUniversityNews: Dispatch<SetStateAction<boolean>>;
  metro: boolean;
  setMetro: Dispatch<SetStateAction<boolean>>;
  deviceID: string;
  setDeviceID: Dispatch<SetStateAction<string>>;
}

/**
 * Shared NotificationContext for Settings and Onboarding page:
 * - Important for knowing push notif enabled within both the app context and device settings context
 */

// These are just defaults in case the child can't find a provider parent
export const NotificationContext = createContext<NotificationContextType>({
  systemPermissionStatus: "undetermined",
  setSystemPermissionStatus: () => {},
  checkPermissions: () => {},
  requestPermission: async () => "",
  breaking: true,
  setBreaking: () => {},
  universityNews: true,
  setUniversityNews: () => {},
  metro: true,
  setMetro: () => {},
  deviceID: "",
  setDeviceID: () => {},
});

export const NotificationProvider = ({ children }) => {
  // State for managing the actual system permission status
  const [systemPermissionStatus, setSystemPermissionStatus] =
    useState("undetermined");

  // Notifications
  const [universityNews, setUniversityNews] = useState(true);
  const [metro, setMetro] = useState(true);
  const [breaking, setBreaking] = useState(true);

  // Device ID & push token
  const [deviceID, setDeviceID] = useState("");

  // On app startup, check the permissions of the system settings and the internal app settings
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
      setAsync("systemPermissionStatus", status);
      return status;
    } else {
      console.log("Must use physical device for Push Notifications");
      return "error";
    }
  };

  useEffect(() => {
    // Handler for AppState changes
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        const { status } = await Notifications.getPermissionsAsync();
        setSystemPermissionStatus(status);
        console.log("App has come to the foreground");
      }
    };

    // Subscribe to AppState changes
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Initial permission check
    checkPermissions();

    // Cleanup function to remove the listener
    return () => {
      subscription.remove();
    };
  }, []);

  // Effect to check permissions when the app loads
  useEffect(() => {
    console.log("Checking permissions useEffect in NotificationProvider");
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
        universityNews,
        setUniversityNews,
        metro,
        setMetro,
        deviceID,
        setDeviceID,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);