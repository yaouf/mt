import { useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { UserProps } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";

/**
 * Page for settings
 *   - show login button if not already logged in
 *   - if logged in, show name/email
 *   - option to allow push notifications (send id to backend)
 *   - toggle to choose different types of notifications
 *   - option to delete account
 *   - contact us / feedback ?
 *
 * @returns Settings screen
 */
function SettingsScreen({
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  community,
  setCommunity,
}: UserProps) {
  // const [name, setName] = useState<string>("");
  const [pushNotifs, setPushNotifs] = useState<boolean>(false);
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // const styles = StyleSheet.create({
  //   button: {
  //     backgroundColor: "#808080",
  //     padding: 10,
  //     borderRadius: 5,
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  //   buttonText: {
  //     color: "#fff",
  //     fontSize: 16,
  //   },
  // });

  function handleLogin() {
    setLoggedIn(true);
    setUsername("X"); //??
    console.log("Logged in.");
  }

  async function handleLogout() {
    AsyncStorage.setItem("hasVisited", "false"); // Pauses the rest of the login functionality until hasVisited is set to true
    setLoggedIn(false);
    setUsername(""); //??
    setCommunity("");
    console.log("Logged Out");
    console.log("Navigating back to Login");
  }

  function handlePushNotifs() {
    setPushNotifs((previousState) => !previousState);
  }

  function handleContact() {
    console.log("Contact!");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loggedIn ? (
        <>
          <Text>{username}</Text>
          <CustomButton text={"Logout"} onPress={handleLogout} />
          <CustomButton text={"Delete account"} onPress={handleLogout} />
        </>
      ) : (
        <CustomButton text={"Login"} onPress={handleLogin} />
      )}
      <Text>Push Notifications</Text>
      <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
      <CustomButton text={"Contact us"} onPress={handleContact} />
    </View>
  );
}

export default SettingsScreen;
