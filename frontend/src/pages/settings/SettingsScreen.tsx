import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
  AppState,
  Platform,
  FlatList,
} from "react-native";
import { UserProps } from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { removeAsync, setAsync } from "../../code/helpers";
import { settings } from "src/styles/pages";
import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPushToken } from "../../code/pushNotifs"; // import the function
import * as Notifications from "expo-notifications";
import { useNotification } from "./NotificationProvider";
import SavedArticles from "./SavedArticles";
import SettingsLink from "./SettingsLink";
import { text } from "src/styles/styles";
import Notif from "src/components/Notif";
import Divider from "src/components/Divider";

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

  const {
    appNotificationEnabled,
    setAppNotificationEnabled,
    toggleNotifications,
    checkPermissions,
  } = useNotification();

  /**
   * Load the state variables from async storage if they exist and update their values
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

  // Load settings (including other unrelated settings if they exist)
  const loadSettings = async () => {
    load();
    await checkPermissions(); // Check system permissions everytime app loads
  };

  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Update settings in async storage, call backend update
   */
  // const updateSettings = () => {
  //   setAsync("breakingNotifs", JSON.stringify(breakingNotifs));
  //   setAsync("weeklyNotifs", JSON.stringify(weeklyNotifs));

  //   console.log("update settings!!");
  // };

  // Handle the switch toggle
  // const handleToggle = (newState) => {
  //   // Call the context function to handle the actual toggle logic
  //   toggleNotifications(newState);
  // };

  const supportRef = useRef<FlatList>(null);
  const support = [
    { id: 1, title: "Manage Account" },
    { id: 2, title: "Report a Bug" },
    { id: 3, title: "Contact Us" },
  ];

  const moreRef = useRef<FlatList>(null);
  const more = [
    { id: 1, title: "Website", link: "https://www.browndailyherald.com/" },
    {
      id: 2,
      title: "Instagram",
      link: "https://www.instagram.com/browndailyherald/",
    },
    { id: 3, title: "Twitter", link: "https://x.com/the_herald" },
    {
      id: 4,
      title: "Facebook",
      link: "https://www.facebook.com/browndailyherald",
    },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SavedArticles />

      {/* {loggedIn ? (
        <>
          <Text>{username}</Text>
          <CustomButton text={"Logout"} onPress={handleLogout} />
          <CustomButton text={"Delete account"} onPress={deleteUser} />
        </>
      ) : (
        <CustomButton text={"Login"} onPress={handleLogin} />
      )} */}

      <View>
        <Text style={text.sectionHeader3}>Stay Updated</Text>
        <View style={{ rowGap: 16 }}>
          <Notif
            title="Breaking News"
            description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          />
          <Notif
            title="Weekly Summary"
            description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          />
        </View>
      </View>

      <FlatList
        ref={moreRef}
        data={more}
        renderItem={({ item }) => (
          <SettingsLink title={item.title} link={item.link} />
        )}
        ItemSeparatorComponent={Divider}
      />
    </View>
  );
}

export default SettingsScreen;
