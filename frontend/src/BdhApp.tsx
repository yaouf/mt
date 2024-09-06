import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import { NotificationProvider } from "./pages/settings/NotificationProvider";


import * as Notifications from "expo-notifications";
import NotificationHandler from "./NotificationHandler";

const fullStack = createStackNavigator();

const linking = {
  prefixes: ['com.browndailyherald.thebrowndailyherald"://', 'https://browndailyherald.com'],  // custom app scheme and web domain
  config: {
    screens: {
      HomeScreen: 'home',
      Article: 'article/:slug',  // handles the article slug from deep link
    },
  },
};

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

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
    handleSuccess: async () => console.log('handle success notification'),
    handleError: async () => console.log('handle error notification'),
  });


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

  return (
    <NotificationProvider>
      <NavigationContainer theme={MyTheme} linking={linking}>
      <NotificationHandler />
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
