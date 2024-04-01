import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

type LoginProps = {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  pushNotifs: boolean;
  setPushNotifs: Dispatch<SetStateAction<boolean>>;
};

/**
 * Page for settings
 *   - show login button if not already logged in
 *   - if logged in, show name/email
 *   - option to allow push notifications (send id to backend)
 *   - toggle to choose different types of notifications
 *   - option to delete account
 *   - contact us / feedback ?
 *
 * @returns Settings screen
 */
function Settings({
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  pushNotifs,
  setPushNotifs,
}: LoginProps) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#808080",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  function handleLogin() {
    setLoggedIn(true);
    setUsername("X"); // replace with username
    console.log("Logged in.");
  }

  function handleDelete() {
    console.log("Account deleted.");
  }
  /*
  function handlePushNotifs() {
    setPushNotifs((previousState) => !previousState);
    PushNotificationHandler();
  }
  */

  const handlePushNotifs = () => {
    setPushNotifs((previousState: boolean) => !previousState);
  };

  const sendTokenToBackend = (token: any) => {
    // Send the token to your backend server via an API call
    // Example: fetch('https://your-backend-api.com/register-push-token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ token }),
    // });
    console.log(token);
  };

  const registerForPushNotifications = async () => {
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
          sendTokenToBackend(token);
        } else {
          // Permission not granted, handle accordingly
        }
      } catch (error) {
        console.error("Error registering for push notifications:", error);
      }
    }
  };

  function handleContact() {
    console.log("Contact!");
  }

  function handleLogout() {
    setLoggedIn(false);
    console.log("Logged out.");
  }

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loggedIn ? (
        <>
          <Text>{username}</Text>
          <Pressable onPress={handleDelete} style={styles.button}>
            <Text style={styles.buttonText}>Delete account</Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Pressable onPress={handleContact} style={styles.button}>
            <Text style={styles.buttonText}>Contact us</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Pressable onPress={handleContact}>
            <Text>Contact us</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default Settings;
