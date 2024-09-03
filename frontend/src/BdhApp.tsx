import React, { useEffect, useState, useRef } from "react";
import { View, Animated } from "react-native";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationProvider } from "./pages/settings/NotificationProvider";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize animated value

  useEffect(() => {
    const load = async () => {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        if (onboarded === "true") {
          setHasOnboarded(true);
        }
      } catch (err) {
        console.log("err while setting up notifications", err);
      }
    };
    load();

    // Trigger the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration of the fade-in animation
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

    // Returning cleanup function for removing listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NotificationProvider>
      <NavigationContainer theme={MyTheme}>
        <SafeAreaProvider>
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
          </Animated.View>
        </SafeAreaProvider>
      </NavigationContainer>
    </NotificationProvider>
  );
}

export default BdhApp;
