import React, { useEffect, useState } from "react";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  const load = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      if (onboarded === "true") {
        setHasOnboarded(true); // TODO: for demo, as false for now, change to true when onboarding is finished developing
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
