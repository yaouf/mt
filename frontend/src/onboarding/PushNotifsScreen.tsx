import { View, Text, Switch, Platform } from "react-native";
import { PushNotifProps } from "../types/types";

import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";
import { getPushToken } from "../code/pushNotifs";
import { notifToggle } from "../styles/styles";
import { API_KEY, API_URL } from "@env";
import { useState } from "react";

function PushNotifsScreen(props: PushNotifProps) {
  const [breakingNotifs, setBreakingNotifs] = useState<boolean>(true); // default to true, user can change
  const [weeklyNotifs, setWeeklyNotifs] = useState<boolean>(true);
  const [pushToken, setPushToken] = useState("");

  const createDevice = async () => {
    const body = JSON.stringify({
      deviceType: Platform.OS,
      breakingNewsAlerts: breakingNotifs,
      weeklySummaryAlerts: weeklyNotifs,
      expoPushToken: pushToken,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: body,
      redirect: "follow",
    };

    fetch(API_URL + "/createDevice", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log("!!!!!", result))
      .catch((error) => console.error(error));
  };

  const saveNotifPreferences = async () => {
    setAsync("breakingNotifs", JSON.stringify(breakingNotifs));
    setAsync("weeklyNotifs", JSON.stringify(weeklyNotifs));

    await getPushToken(setPushToken);
    console.log("token", pushToken);

    await createDevice();

    props.navigation.navigate("Done");
  };

  // TODO: can i always send push tokeN??? or only if one of those is false
  // and if so do we have to remove push token from db if opt out later?
  // or is this like just registering the device?

  return (
    <View>
      <Text>Get the latest breaking news right to your phone!</Text>
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
      <CustomButton text={"Save Changes"} onPress={saveNotifPreferences} />
    </View>
  );
}

export default PushNotifsScreen;
