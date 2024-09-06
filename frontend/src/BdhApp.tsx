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



import { Image, Text, Linking } from "react-native";
import { articleStyles } from "src/styles/article";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Article } from "src/types/data";
import { Dispatch, SetStateAction } from "react";
import { fetchArticle } from "src/code/fetchContent";
import WebView from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import NotificationHandler from "./NotificationHandler";

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

  return (
    <NotificationProvider>
      <NavigationContainer theme={MyTheme}>
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
