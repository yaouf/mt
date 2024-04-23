import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { UserProps } from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { removeAsync, setAsync } from "../../code/helpers";
import { notifToggle } from "../../styles/styles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
function SettingsScreen() {
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<string>("");

  const [breakingNotifs, setBreakingNotifs] = useState<boolean>(true); // default to true, user can change
  const [weeklyNotifs, setWeeklyNotifs] = useState<boolean>(true);

  /**
   * load the state variables from async storage if they exist and update their values
   * (on first load of settings page only)
   */
  const load = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      if (username) {
        setUsername(username);
      }

      const loggedIn = await AsyncStorage.getItem("loggedIn");
      if (loggedIn === "true") {
        setLoggedIn(true);
      }

      const community = await AsyncStorage.getItem("community");
      if (community) {
        setCommunity(community);
      }

      const breakingNotifs = await AsyncStorage.getItem("breakingNotifs");
      if (breakingNotifs === "false") {
        // since default is true
        setBreakingNotifs(false);
      }

      const weeklyNotifs = await AsyncStorage.getItem("weeklyNotifs");
      if (weeklyNotifs === "false") {
        setWeeklyNotifs(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /**
   * login in user and update async storage
   */
  function handleLogin() {
    const username = "X"; //TODO: get username from auth

    setAsync("username", username);
    setAsync("loggedIn", "true");

    setUsername(username);
    setLoggedIn(true);

    console.log("Logged in.");
  }

  /**
   * logout user and clear async storage
   */
  async function handleLogout() {
    setAsync("loggedIn", "false");
    removeAsync("username");
    removeAsync("community");

    setLoggedIn(false);
    setUsername("");
    setCommunity("");

    console.log("Logged Out");
  }

  /**
   * delete account
   * clear async storage
   */
  async function deleteUser() {
    // call backend to delete, logout for now
    handleLogout();
    console.log("deleted account");
  }

  // function handlePushNotifs() {
  //   setPushNotifs((previousState) => !previousState);
  // }

  /**
   * update settings in async storage, call backend update
   */
  const updateSettings = () => {
    setAsync("breakingNotifs", JSON.stringify(breakingNotifs));
    setAsync("weeklyNotifs", JSON.stringify(weeklyNotifs));

    // TODO: do i need to request push token again?
    // is there a way to know if the backend already has it?
    // or just do this everytime a setting is changed - update settings doesn't take a push token though
    console.log("update settings!!");
  };

  function handleContact() {
    console.log("Contact!");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loggedIn ? (
        <>
          <Text>{username}</Text>
          <CustomButton text={"Logout"} onPress={handleLogout} />
          <CustomButton text={"Delete account"} onPress={deleteUser} />
        </>
      ) : (
        <CustomButton text={"Login"} onPress={handleLogin} />
      )}
      <View style={{ margin: 30 }}>
        <Text>Push Notifications</Text>
        <View style={notifToggle.toggleRow}>
          <Text>Breaking News Alerts</Text>
          <Switch
            value={breakingNotifs}
            onValueChange={() =>
              setBreakingNotifs((previousState: boolean) => !previousState)
            }
          />
        </View>
        <View style={notifToggle.toggleRow}>
          <Text>Weekly Summary </Text>
          <Switch
            value={weeklyNotifs}
            onValueChange={() =>
              setWeeklyNotifs((previousState: boolean) => !previousState)
            }
          />
        </View>
        <CustomButton text={"Save changes"} onPress={updateSettings} />
      </View>
      <CustomButton text={"Contact us"} onPress={handleContact} />
    </View>
  );
}

export default SettingsScreen;
