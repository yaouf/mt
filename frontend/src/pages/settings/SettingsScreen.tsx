import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Divider from "src/components/Divider";
import Notif from "src/components/Notif";
import { settings } from "src/styles/pages";
import {
  baseStyles,
  font2,
  text,
  varTextColor
} from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { NotificationContext } from "./NotificationProvider";
import SavedArticlesPreview from "./SavedArticlesPreview";
import SettingsLink from "./SettingsLink";

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
    universityNews,
    setUniversityNews,
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

        const universityNewsNotifs = await AsyncStorage.getItem("universityNewsNotifs");
        setUniversityNews(universityNewsNotifs === "true");

        const dailyNotifs = await AsyncStorage.getItem("dailyNotifs");
        setDaily(dailyNotifs === "true");

        const id = await AsyncStorage.getItem("deviceID");
        console.log("this is the device id in the settingsscreen", id);
        if (id) {
          setDeviceID(id);
        } else {
          console.log("Device ID is not being set in settings screen");
        }

        await checkPermissions(); // Check system permissions everytime app loads
      } catch (err) {
        console.log(err);
      } 
    };

    load();
  }, []);

  console.log("statussss", systemPermissionStatus, breaking, universityNews, daily);
  console.log("Device ID in settings:", deviceID);

  const support = [
    // { id: 1, title: "Manage Account", link: "" }, // TODO: once make accounts and stuff, addd this
    {
      id: 2,
      title: "Report a Bug",
      link: "https://docs.google.com/forms/d/1elxuyYjd2ApaVcOmxDiCEvAkzURuOwMjVB_WeMfjyNg/edit",
    }, // TODO: add link
    {
      id: 3,
      title: "Contact Us",
      link: "https://www.browndailyherald.com/page/contact", // TODO: might want to add a mobile team email here
    },
    {
      id: 4,
      title: "Privacy Policy",
      link: "https://www.browndailyherald.com/page/privacy",
    },
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
    {
      id: 5,
      title: "Submit a Tip",
      link: "https://www.browndailyherald.com/page/submit",
    },
    {
      id: 6,
      title: "Donate",
      link: "https://secure.lglforms.com/form_engine/s/JydyLYLlWAfeK0wrZwuLgg",
    },
  ];

  return (
    <ScrollView>
      <SavedArticlesPreview navigation={navigation} />
      <Divider />

      <View style={baseStyles.container}>
        <Text style={text.sectionHeader1}>Stay Updated</Text>
        <View style={{ rowGap: 16, marginTop: 4 }}>
          <Notif
            title="Breaking News"
            description="Urgent and developing coverage"
            value={breaking}
            setValue={setBreaking}
            asyncName="breakingNotifs"
          />
          <Notif
            title="University News"
            description="The latest on Brown and the campus community"
            value={universityNews}
            setValue={setUniversityNews}
            asyncName="universityNewsNotifs"
          />
          <Notif
            title="Metro"
            description="Updates from Providence and beyond"
            value={daily}
            setValue={setDaily}
            asyncName="dailyNotifs"
          />
        </View>
      </View>
      <Divider />

      <View>

        <Text
          style={{
            ...settings.smallHeading,
            marginBottom: 22,
            paddingHorizontal: 16,
          }}
        >
          Support
        </Text>
        {support.map((link, i) => (
          <View key={`support-${i}`} style={{ paddingHorizontal: 4, marginBottom: 12 }}>
            <SettingsLink title={link.title} link={link.link} />
          </View>
        ))}
      </View>
      <View>
        <Text
          style={{
            ...settings.smallHeading,
            marginBottom: 22,
            marginTop: 32,
            paddingHorizontal: 16,
          }}
        >
          More BDH
        </Text>
        {links.map((link, i) => (
          <View key={`more-bdh-${i}`} style={{ paddingHorizontal: 4, marginBottom: 12, }}>
            <SettingsLink title={link.title} link={link.link} />
          </View>
        ))}
      </View>
      <View>
        <Text
          style={{
            ...settings.smallHeading,
            marginBottom: 18,
            marginTop: 32,
            paddingHorizontal: 16,
          }}
        >
          Credits
        </Text>
        <View style={{ paddingHorizontal: 4 }}>
          <SettingsLink
            title="Development Team"
            link={"DevTeam"}
            inApp={true}
            navigation={navigation}
          />
          {/* <Divider marginBottom={12} marginTop={12} color={varGray1} /> */}
        </View>
        <Text
          style={{
            marginHorizontal: 16,
            marginVertical: 20,
            fontSize: 12,
            color: varTextColor,
            fontFamily: font2,
          }}
        >
          All Content © 2024 The Brown Daily Herald, Inc.
        </Text>
      </View>
    </ScrollView>
  );
}

export default SettingsScreen;
