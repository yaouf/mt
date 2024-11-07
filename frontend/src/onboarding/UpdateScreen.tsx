import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { font2 } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";

SplashScreen.preventAutoHideAsync();

const { height: screenHeight } = Dimensions.get("window");

function UpdateScreen({ navigation }: NavProp) {
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
      <View style={styles.topSection}>
        <Image
          source={require("assets/logo-black.png")}
          style={styles.img}
          resizeMode="contain"
          accessibilityHint="Brown Daily Herald Logo"
        />
      </View>
      <View style={styles.middleSection}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.description}>
          We've added new notification preferences. Continue to update your
          existing preferences.
        </Text>
      </View>
      <View style={styles.bottomSection}>
        {showButton && (
          <TouchableOpacity
            onPress={() => navigation.push("PushNotifs")}
            style={styles.button}
            accessible={true}
            accessibilityHint="Continue to update the application"
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: "5%",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: screenHeight * 0.05,
  },
  middleSection: {
    marginTop: screenHeight * 0.2,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bottomSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: screenHeight * 0.3,
  },
  title: {
    fontFamily: font2,
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginTop: 0.0 * screenHeight,
  },
  description: {
    fontFamily: font2,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginTop: 0.01 * screenHeight,
    marginBottom: 16,
  },
  img: {
    width: "100%",
    // height: "15%",
    // marginTop: screenHeight * 0.05,
    // marginBottom: screenHeight * 0.05,
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
