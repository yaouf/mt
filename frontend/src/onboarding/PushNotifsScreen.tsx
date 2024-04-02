import { View, Text, Switch, Platform } from "react-native";
import { PushNotifProps } from "../types/types";

import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";
import { getPushToken } from "../code/pushNotifs";
import { notifToggle } from "../styles/styles";
import { API_KEY, API_URL } from "@env";

function PushNotifsScreen(props: PushNotifProps) {
  const userProps = props.route.params;
  console.log(userProps);

  const createDevice = async () => {
    const body = JSON.stringify({
      deviceType: Platform.OS,
      breakingNewsAlerts: userProps.breaking,
      weeklySummaryAlerts: userProps.weekly,
      expoPushToken: userProps.pushToken,
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
    setAsync("breakingNotifs", JSON.stringify(userProps.breaking));
    setAsync("weeklyNotifs", JSON.stringify(userProps.weekly));

    await getPushToken(userProps.setPushToken);
    console.log("token", userProps.pushToken);
    // TODO: call to backend with the push token and user settings for notifs
    console.log("breaking", userProps.breaking);
    console.log("weekly", userProps.weekly);

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
          value={userProps.breaking}
          onValueChange={() =>
            userProps.setBreaking((previousState: boolean) => !previousState)
          }
        />
      </View>
      <View style={notifToggle.toggleRow}>
        <Text>Weekly Summary </Text>
        <Switch
          value={userProps.weekly}
          onValueChange={() =>
            userProps.setWeekly((previousState: boolean) => !previousState)
          }
        />
      </View>
      <CustomButton text={"Save Changes"} onPress={saveNotifPreferences} />
    </View>
  );
}

export default PushNotifsScreen;
