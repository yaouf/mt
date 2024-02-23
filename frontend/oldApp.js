import React, { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
const Stack = createStackNavigator();

async function registerForPushNotificationsAsync() {
  let token;
  console.log("registerForPushNotificationsAsync called");
  if (Device.isDevice) {
    console.log("Device is a device")
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
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
// Define your screen components
function HomeScreen({ navigation }) {
  // registerForPushNotificationsAsync();
  const webviewRef = useRef(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://www.browndailyherald.com/" }}
        style={styles.webview}
        onNavigationStateChange={navState => {
          // The WebView is not at the top of its history stack
          if (navState.canGoBack) {
            navigation.setOptions({
              headerLeft: () => (
                <Button
                  onPress={() => webviewRef.current.goBack()}
                  title="Back"
                  color="#000"
                />
              ),
            });
          } else {
            navigation.setOptions({
              headerLeft: () => null,
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

function QuizScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Quiz/Games!</Text>
    </View>
  );
}

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hello!",
      body: "This notification was scheduled on app load.",
    },
    trigger: { seconds: 1 }, // Schedules the notification to be shown in 10 seconds
  });
}

export default function App() {
  // async function registerForPushNotificationsAsync() {
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== "granted") {
  //     alert("Failed to get push token for push notification!");
  //     return;
  //   }
  //    scheduleNotification();

  // }
   React.useEffect(() => {
    registerForPushNotificationsAsync();
   }, []);
  //  registerForPushNotificationsAsync();
  //  scheduleNotification();
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
