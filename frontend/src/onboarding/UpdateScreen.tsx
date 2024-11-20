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
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView onLayout={onLayoutRootView} style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("assets/logo-black.png")}
          style={styles.img}
          resizeMode="contain"
          accessibilityHint="Brown Daily Herald Logo"
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.middleSection}
        showsVerticalScrollIndicator={false}
      >
<<<<<<< HEAD
         <Text style={styles.title}>Welcome Back!</Text>
=======
        <Text style={styles.title}>Welcome Back!</Text>
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
        <Text style={styles.description}>
          We've made some exciting updates:
        </Text>
        <View style={styles.bulletList}>
<<<<<<< HEAD
          <Text style={styles.bulletPoint}>• New notification preferences for sections</Text>
          <Text style={styles.bulletPoint}>• Customizable home page to reorder sections for your interests</Text>
          <Text style={styles.bulletPoint}>• Editor's Picks and Most Popular sections in search</Text>
          <Text style={styles.bulletPoint}>• Double-tap in article view to save for later</Text>
          <Text style={styles.bulletPoint}>• Bug fixes and performance improvements</Text>
=======
          <Text style={styles.bulletPoint}>
            • New notification preferences for sections
          </Text>
          <Text style={styles.bulletPoint}>
            • Customizable home page to reorder sections for your interests
          </Text>
          <Text style={styles.bulletPoint}>
            • Editor's Picks sections in search
          </Text>
          <Text style={styles.bulletPoint}>
            • Double-tap in article view to save for later
          </Text>
          <Text style={styles.bulletPoint}>
            • Bug fixes and performance improvements
          </Text>
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
        </View>
      </ScrollView>
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
    </SafeAreaView>
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
    height: "100%",
    flexDirection: "column",
  },
  topSection: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // paddingBottom: 0.01 * screenHeight,
    // paddingTop: screenHeight * 0.02,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: "7%",
    width: "100%",
<<<<<<< HEAD

  },
  
=======
  },

>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
  middleSection: {
    marginTop: screenHeight * 0.05,
    // flex: 1,
    // justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  bottomSection: {
    // flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: screenHeight * 0.02,
  },
  title: {
    fontFamily: font2,
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginTop: 0.0 * screenHeight,
  },
  description: {
    fontFamily: font2,
    fontSize: 18,
    fontWeight: "400",
    color: "#000",
    marginTop: 0.01 * screenHeight,
    marginBottom: 16,
  },
  bulletList: {
<<<<<<< HEAD
    width: '100%',
=======
    width: "100%",
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
    marginTop: 18,
  },
  bulletPoint: {
    fontFamily: font2,
    fontSize: 18,
    fontWeight: "400",
    color: "#000",
    marginBottom: 24,
  },
  bold: {
    fontWeight: "700",
  },
  img: {
    // width: "100%",
    height: 70,
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
