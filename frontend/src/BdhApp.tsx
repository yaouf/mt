import React, { useEffect, useState } from "react";
import Onboarding from "./onboarding/Onboarding";
import Nav from "./pages/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAsync } from "./code/helpers";

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  // creates saved articles list (intially empty on first load) and checks if has onboarded
  const load = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedArticles");
      if (!saved) {
        setAsync("savedArticles", JSON.stringify({}));
      }

      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      if (onboarded === "true") {
        setHasOnboarded(true); // toggle to false for development
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
