import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { LoginProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "../components/CustomButton";
/**
 * Page for login
 *   - show only on first load of the app
 *   - user can choose to log in or continue to app without logging in
 *   - login button directs to firebase auth
 *
 * @returns Login screen
 */
function LoginScreen({
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  community,
  setCommunity,
}: LoginProps) {
  // State of whether user has already visited the login screen
  const [hasVisited, setHasVisited] = useState<boolean>(false);

  // AsyncStorage allows data to be stored only on the user's local device - info is saved like a dictionary
  useEffect(() => {
    // Function that checks if user has opened login screen before
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem("hasVisited");
      if (hasVisited) {
        setHasVisited(true);
      }
    };
    checkFirstVisit();
  }, []);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: "blue",
      padding: 10,
      width: 100,
      height: 30,
      borderRadius: 20,
      borderColor: "red",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  async function handleLogin(community: string) {
    await AsyncStorage.setItem("hasVisited", "true"); // Pauses the rest of the login functionality until hasVisited is set to true
    // If Logged In as Brown or Other Community, set as logged in
    if (community != "Guest") {
      setLoggedIn(true);
      setUsername("Blueno");
      console.log("Logged into Brown or Other!");
    }
    // If Guest Browsing, set to not logged in
    else {
      setLoggedIn(false);
      console.log("Browsing as Guest");
    }
    // Setting the community
    setCommunity(community);
  }

  // Only show login screen on first load
  if (hasVisited) {
    console.log("You can't come here again!");
    // Navigate to Home
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!loggedIn ? (
        <>
          <Pressable onPress={() => handleLogin("Brown")}>
            <Text>Login to Brown Community</Text>
          </Pressable>
          <Pressable onPress={() => handleLogin("Other")}>
            <Text>Login to Other Community</Text>
          </Pressable>
          <Pressable onPress={() => handleLogin("Guest")}>
            <Text>I don't want to Login!</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text>
            {" "}
            Welcome, {username} to {community}
          </Text>
          <CustomButton
            onPress={handleLogin}
            text="Log In!"
            style={{ backgroundColor: "red" }}
          ></CustomButton>
          {/* <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable> */}
        </>
      )}
    </View>
  );
}

export default LoginScreen;
