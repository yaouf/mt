import React, { useEffect, useState } from "react";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendNotification, setAsync } from "./code/helpers";
import { NotificationProvider } from "./pages/settings/NotificationProvider";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { menuItems } from "./code/setup";
import { createDevice } from "./code/serverlessAPIs";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

// Handle foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const fullStack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFF",
  },
};

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        if (onboarded === "true") {
          setHasOnboarded(true); // toggle to false for development
        }
      } catch (err) {
        console.log("err while setting up notifications", err);
      }
    };
    load();
  }, []); // Added dependency array to ensure this only runs once on mount

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // TODO: notifications - https://docs.expo.dev/versions/latest/sdk/notifications/#notification

  return (
    <NotificationProvider>
      <NavigationContainer
        theme={MyTheme}
        // linking={{
        //   config: {
        //     // Configuration for linking
        //   },
        //   async getInitialURL() {
        //     // First, you may want to do the default deep link handling
        //     // Check if app was opened from a deep link
        //     const url = await Linking.getInitialURL();

        //     if (url != null) {
        //       return url;
        //     }

        //     // Handle URL from expo push notifications
        //     const response =
        //       await Notifications.getLastNotificationResponseAsync();

        //     return response?.notification.request.content.data.url;
        //   },
        //   subscribe(listener) {
        //     const onReceiveURL = ({ url }: { url: string }) => listener(url);

        //     // Listen to incoming links from deep linking
        //     const eventListenerSubscription = Linking.addEventListener(
        //       "url",
        //       onReceiveURL
        //     );

        //     // Listen to expo push notifications
        //     const subscription =
        //       Notifications.addNotificationResponseReceivedListener(
        //         (response) => {
        //           const url = response.notification.request.content.data.url;

        //           // Any custom logic to see whether the URL needs to be handled
        //           //...
        //           console.log("******", response);

        //           // Let React Navigation handle the URL
        //           listener(url);
        //         }
        //       );

        //     return () => {
        //       // Clean up the event listeners
        //       eventListenerSubscription.remove();
        //       subscription.remove();
        //     };
        //   },
        // }}
      >
        {hasOnboarded ? (
          <Nav />
        ) : (
          <fullStack.Navigator
            initialRouteName={"Onboarding"}
            screenOptions={{ gestureEnabled: false }}
          >
            <fullStack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
            <fullStack.Screen
              name="MainApp"
              component={Nav}
              options={{ headerShown: false }}
            />
          </fullStack.Navigator>
        )}
      </NavigationContainer>
    </NotificationProvider>
  );
}

export default BdhApp;
