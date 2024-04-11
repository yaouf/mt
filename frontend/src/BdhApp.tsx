import React, { useEffect, useState } from "react";
import { UserProps } from "./types/types";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./nav/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SmallCard from "./components/cards/SmallCard";

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  const load = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      if (onboarded === "true") {
        setHasOnboarded(false); // TODO: for demo, as false for now, change to true when onboarding is finished developing
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!hasOnboarded) {
    return <Onboarding setHasOnboarded={setHasOnboarded} />;
  } else {
    return <Nav />;
  }
}

export default BdhApp;
