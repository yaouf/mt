import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Divider from "src/components/Divider";
import NotifToggle from "src/components/NotifToggle";
import { settings } from "src/styles/pages";
import { baseStyles, darkStyles, font2, text, darkModeText, varTextColor } from "src/styles/styles";
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
    metro,
    setMetro,
    sports,
    setSports,
    artsAndCulture,
    setArtsAndCulture,
    scienceAndResearch,
    setScienceAndResearch,
    opinions,
    setOpinions,
    deviceID,
    setDeviceID,
    checkPermissions,
    systemPermissionStatus,
  } = useContext(NotificationContext);

  // on first load, get data from async storage
  useEffect(() => {
    // TODO 1: maybe do these checks before loading notif components?
    // log all react context
    console.log("react context in settings screen", {
      breaking,
      universityNews,
      metro,
      opinions,
      artsAndCulture,
      sports,
      scienceAndResearch,
    });
    const load = async () => {
      console.log(
        "notification settings in settings screen",
        systemPermissionStatus,
        breaking,
        universityNews,
        metro,
        opinions,
        artsAndCulture,
        sports,
        scienceAndResearch
      );

      try {
        const breakingNotifs = await AsyncStorage.getItem("breakingNotifs");
        console.log("Calling setState in settings screen with value", breakingNotifs === "true", "for breakingNotifs");
        setBreaking(breakingNotifs === "true");
        console.log("breakingNotifs", breakingNotifs);

        const universityNewsNotifs = await AsyncStorage.getItem(
          "universityNewsNotifs"
        );
        console.log("Calling setState in settings screen with value", universityNewsNotifs === "true", "for universityNewsNotifs");
        setUniversityNews(universityNewsNotifs === "true");
        console.log("universityNewsNotifs", universityNewsNotifs);

        const metroNotifs = await AsyncStorage.getItem("metroNotifs");
        console.log("Calling setState in settings screen with value", metroNotifs === "true", "for metroNotifs");
        setMetro(metroNotifs === "true");
        console.log("metroNotifs", metroNotifs);

        const sportsNotifs = await AsyncStorage.getItem("sportsNotifs");
        console.log("Calling setState in settings screen with value", sportsNotifs === "true", "for sportsNotifs");
        setSports(sportsNotifs === "true");
        console.log("sportsNotifs", sportsNotifs);

        const artsAndCultureNotifs = await AsyncStorage.getItem(
          "artsAndCultureNotifs"
        );
        console.log("Calling setState in settings screen with value", artsAndCultureNotifs === "true", "for artsAndCultureNotifs");
        setArtsAndCulture(artsAndCultureNotifs === "true");
        console.log("artsAndCultureNotifs", artsAndCultureNotifs);

        const scienceAndResearchNotifs = await AsyncStorage.getItem(
          "scienceAndResearchNotifs"
        );
        console.log("Calling setState in settings screen with value", scienceAndResearchNotifs === "true", "for scienceAndResearchNotifs");
        setScienceAndResearch(scienceAndResearchNotifs === "true");
        console.log("scienceAndResearchNotifs", scienceAndResearchNotifs);

        const opinionsNotifs = await AsyncStorage.getItem("opinionsNotifs");
        console.log("Calling setState in settings screen with value", opinionsNotifs === "true", "for opinionsNotifs");
        setOpinions(opinionsNotifs === "true");
        console.log("opinionsNotifs", opinionsNotifs);

        const id = await AsyncStorage.getItem("deviceID");
        // FIXME: why is this null first time?
        console.log("this is the device id in the settingsscreen", id);
        if (id) {
          setDeviceID(id);
        } else {
          console.log("Device ID is not being set in settings screen");
        }
        // TODO: if deviceID is null or "", go to onboarding screen
        console.log("Device ID from context in settings before update:", deviceID);

        checkPermissions(); // Check system permissions everytime app loads
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  const app_settings = [
    {
      id: 1,
      title: "Display Settings",
      link: "",
    },
  ]

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
  //dark mode related functions
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("darkMode");
      setIsDarkMode(storedTheme === "true");
    };
    loadTheme();
  }, []);

  // const toggleTheme = async () => {
  //   const newTheme = !isDarkMode;
  //   setIsDarkMode(newTheme);
  //   console.log("newTheme " + newTheme);
  //   await AsyncStorage.setItem("darkMode", newTheme.toString());
  // };

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      AsyncStorage.setItem("darkMode", newTheme.toString());
      console.log("newTheme " + newTheme);
      return newTheme;
    });
  };

  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  const textStyle = isDarkMode ? darkModeText : text;

  return (
    <ScrollView>
      <SavedArticlesPreview navigation={navigation} />
      <Divider isDarkMode={isDarkMode} />

      <View style={containerStyle.container}>
        <Text style={textStyle.sectionHeader1}>Stay Updated</Text>

        <View style={{ rowGap: 16, marginTop: 4 }}>
          <NotifToggle
            title="Breaking News"
            description="Urgent and developing coverage"
            value={breaking}
            setValue={setBreaking}
            asyncName="breakingNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="University News"
            description="The latest on Brown and the campus community"
            value={universityNews}
            setValue={setUniversityNews}
            asyncName="universityNewsNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="Metro"
            description="Updates from Providence and beyond"
            value={metro}
            setValue={setMetro}
            asyncName="metroNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="Sports"
            description="Game coverage and exclusives"
            value={sports}
            setValue={setSports}
            asyncName="sportsNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="Arts and Culture"
            description="Events and reviews from our critics"
            value={artsAndCulture}
            setValue={setArtsAndCulture}
            asyncName="artsAndCultureNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="Science and Research"
            description="The cutting edge of research"
            value={scienceAndResearch}
            setValue={setScienceAndResearch}
            asyncName="scienceAndResearchNotifs"
            isDarkMode={isDarkMode}
          />
          <NotifToggle
            title="Opinions"
            description="Columns, op-eds and editorials"
            value={opinions}
            setValue={setOpinions}
            asyncName="opinionsNotifs"
            isDarkMode={isDarkMode}
          />
        </View>
      </View>
      <Divider isDarkMode={isDarkMode}/>
      <View style={{backgroundColor: containerStyle.container.backgroundColor}}>
        <Text
          style={{
            ...settings.smallHeading,
            marginBottom: 22,
            paddingHorizontal: 16,
          }}
        >
          App Settings
        </Text>
        <View style={{ paddingHorizontal: 4}}>
          <SettingsLink
            title="Display Settings"
            link={"DisplaySettings"}
            inApp={true}
            navigation={navigation}
            extraProps={{ isDarkMode, toggleTheme }}
          />
          {/* <Divider marginBottom={12} marginTop={12} color={varGray1} /> */}
        </View>
      </View>
      <View style={{backgroundColor: containerStyle.container.backgroundColor}}>
        <Text
          style={{
            ...settings.smallHeading,
            marginTop: 32,
            marginBottom: 22,
            paddingHorizontal: 16,
          }}
        >
          Support
        </Text>
        {support.map((link, i) => (
          <View
            key={`support-${i}`}
            style={{ paddingHorizontal: 4, marginBottom: 12, backgroundColor: containerStyle.container.backgroundColor }}
          >
            <SettingsLink title={link.title} link={link.link} extraProps={{ isDarkMode, toggleTheme }}/>
          </View>
        ))}
      </View>
      <View style={{backgroundColor: containerStyle.container.backgroundColor}}>
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
          <View
            key={`more-bdh-${i}`}
            style={{ paddingHorizontal: 4, marginBottom: 12, backgroundColor: containerStyle.container.backgroundColor }}
          >
            <SettingsLink title={link.title} link={link.link} extraProps={{ isDarkMode, toggleTheme }} />
          </View>
        ))}
      </View>
      <View style={{backgroundColor: containerStyle.container.backgroundColor}}>
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
        <View style={{ paddingHorizontal: 4, backgroundColor: containerStyle.container.backgroundColor }}>
          <SettingsLink
            title="Development Team"
            link={"DevTeam"}
            inApp={true}
            navigation={navigation}
            extraProps={{ isDarkMode, toggleTheme }}
          />
          {/* <Divider marginBottom={12} marginTop={12} color={varGray1} /> */}
        </View>
        <Text
          style={{
            marginHorizontal: 16,
            marginVertical: 20,
            fontSize: 14,
            color: textStyle.sectionHeader1.color,
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
