import { View, ScrollView, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationContext, useNotification } from "./NotificationProvider";
import SavedArticles from "./SavedArticles";
import SettingsLink from "./SettingsLink";
import { baseStyles, layout, text } from "src/styles/styles";
import Notif from "src/components/Notif";
import Divider from "src/components/Divider";
import { NavProp } from "src/types/types";
import * as Notifications from "expo-notifications";

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
function SettingsScreen({ navigation }: NavProp) {
  const {
    breaking,
    setBreaking,
    weekly,
    setWeekly,
    daily,
    setDaily,
    deviceID,
    setDeviceID,
    checkPermissions,
    systemPermissionStatus,
    setSystemPermissionStatus,
  } = useContext(NotificationContext);

  // on first load, get data from async storage
  useEffect(() => {
    const load = async () => {
      try {
        const breakingNotifs = await AsyncStorage.getItem("breakingNotifs");
        setBreaking(breakingNotifs === "true");

        const weeklyNotifs = await AsyncStorage.getItem("weeklyNotifs");
        setWeekly(weeklyNotifs === "true");

        const dailyNotifs = await AsyncStorage.getItem("dailyNotifs");
        setDaily(dailyNotifs === "true");

        const id = await AsyncStorage.getItem("deviceID");
        if (id) {
          setDeviceID(id);
        }

        await checkPermissions(); // Check system permissions everytime app loads
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  console.log("statussss", systemPermissionStatus, breaking, weekly, daily);
  console.log("Device ID:", deviceID);

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

  const support = [
    { id: 1, title: "Manage Account", link: "" },
    { id: 2, title: "Report a Bug", link: "" },
    { id: 3, title: "Contact Us", link: "" },
  ];

  const links = [
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
    <ScrollView style={baseStyles.container}>
      <SavedArticles navigation={navigation} />

      <View>
        <Text style={text.sectionHeader3}>Stay Updated</Text>
        <View style={{ rowGap: 16 }}>
          <Notif
            title="Breaking News"
            description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
            value={breaking}
            setValue={setBreaking}
            asyncName="breakingNotifs"
          />
          <Notif
            title="Weekly Summary"
            description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
            value={weekly}
            setValue={setWeekly}
            asyncName="weeklyNotifs"
          />
          <Notif
            title="Daily Summary"
            description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
            value={daily}
            setValue={setDaily}
            asyncName="dailyNotifs"
          />
        </View>
      </View>
      <View style={layout.vStack}>
        <Text style={text.sectionHeader3}>Support</Text>
        {support.map((link, i) => (
          <View key={`support-${i}`}>
            <SettingsLink title={link.title} link={link.link} />
            {i < links.length - 1 ? <Divider /> : ""}
          </View>
        ))}
      </View>
      <View style={layout.vStack}>
        <Text style={text.sectionHeader3}>More BDH</Text>
        {links.map((link, i) => (
          <View key={`more-bdh-${i}`}>
            <SettingsLink title={link.title} link={link.link} />
            {i < links.length - 1 ? <Divider /> : ""}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default SettingsScreen;
