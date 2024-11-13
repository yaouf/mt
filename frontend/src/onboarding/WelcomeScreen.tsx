import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { font2 } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";

SplashScreen.preventAutoHideAsync();

const { height: screenHeight } = Dimensions.get("window");

function WelcomeScreen({ navigation }: NavProp) {
  const [splashScreen, setSplashScreen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    async function onboard() {
      try {
        console.log("onboard");
      } catch (e) {
        console.warn(e);
      } finally {
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
        accessibilityHint="Brown Daily Herald Logo"
      />
      {showButton && (
        <TouchableOpacity
          onPress={() => navigation.push("PushNotifs")}
          style={styles.button}
          accessible={true}
          accessibilityHint="Continue to Notification Preferences"
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: "5%", 

    
  },
  img: {
    width: "90%",
    height: "15%",
    marginTop: screenHeight*.4, 
    marginBottom: screenHeight*.25,
  },
  button: {
    width: "90%", 
    backgroundColor: "#eee",
    borderRadius: 30, 
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#4d4d4d", 
    fontFamily: font2,
    fontWeight: "600", 
    fontSize: 18, 
    fontStyle: "normal",
  },
});
