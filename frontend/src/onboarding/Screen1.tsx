import { useCallback, useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { font2, text, varGray1, varTextColor } from "src/styles/styles";
import { NavProp } from "src/types/types";

SplashScreen.preventAutoHideAsync();

function Screen1({ navigation }: NavProp) {
  const [splashScreen, setSplashScreen] = useState(false); // splash screen prop
  const [showButton, setShowButton] = useState(false); // state to control the visibility of the button

  useEffect(() => {
    async function onboard() {
      try {
        console.log("onboard");
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render once top is fetched
        setSplashScreen(true);
      }
    }
    onboard();
    setTimeout(() => {
      setShowButton(true);
    }, 1000);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (splashScreen) {
      await SplashScreen.hideAsync();
    }
  }, [splashScreen]);

  if (!splashScreen) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <Image
        source={require("assets/logo-black.png")}
        style={styles.img}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => navigation.push("PushNotifs")}>
        <Text style={styles.text}>{showButton ? "Continue" : ""}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Screen1;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  img: {
    width: "80%",
    marginBottom: 80,
  },
  text: {
    color: "#4d4d4d",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 20,
  },
});
