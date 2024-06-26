import React, { useEffect, useState } from "react";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAsync } from "./code/helpers";
import { NotificationProvider } from "./pages/settings/NotificationProvider";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { menuItems } from "./code/setup";

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
        setAsync("savedArticles", JSON.stringify({}));
        setAsync("sectionMenu", JSON.stringify(menuItems));
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        if (onboarded === "true") {
          setHasOnboarded(true); // toggle to false for development
        }
      } catch (err) {
        console.log(err);
      }
    };

    load();
  });

  return (
    <NotificationProvider>
      <NavigationContainer theme={MyTheme}>
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
