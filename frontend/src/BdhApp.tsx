import React, { useEffect, useState } from "react";
import { UserProps } from "./types/types";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./nav/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SmallCard from "./components/cards/SmallCard";

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<string>("");

  const [breakingNotifs, setBreakingNotifs] = useState<boolean>(true); // default to true, user can change
  const [weeklyNotifs, setWeeklyNotifs] = useState<boolean>(true);
  const [pushToken, setPushToken] = useState("");

  const load = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      if (onboarded === "true") {
        setHasOnboarded(false); // TODO: for demo, as false for now, change to true when onboarding is finished developing
      }
      // TODO: i don;t need to handle false right because it is false unless async storage says it's true??

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

      // TODO: don't need to async store push token right??
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const userProps: UserProps = {
    loggedIn: loggedIn,
    setLoggedIn: setLoggedIn,
    username: username,
    setUsername: setUsername,
    community: community,
    setCommunity: setCommunity,
    setHasOnboarded: setHasOnboarded,
    breaking: breakingNotifs,
    setBreaking: setBreakingNotifs,
    weekly: weeklyNotifs,
    setWeekly: setWeeklyNotifs,
    pushToken: pushToken,
    setPushToken: setPushToken,
  };

  if (!hasOnboarded) {
    return <Onboarding {...userProps} />;
  } else {
    return <Nav {...userProps} />;
  }
}

export default BdhApp;
