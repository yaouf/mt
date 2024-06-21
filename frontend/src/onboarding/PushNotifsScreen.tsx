import { View, Text, TouchableOpacity } from "react-native";
import { PushNotifProps } from "../types/types";
import { settings } from "src/styles/pages";
import { useContext } from "react";
import * as Notifications from "expo-notifications";
import { baseStyles, text } from "src/styles/styles";
import Notif from "src/components/Notif";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { setUpDevice } from "../code/setup";

/**
 * Defines how notifications should behave when received by the app
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function PushNotifsScreen({ route, navigation }: PushNotifProps) {
  const {
    breaking,
    setBreaking,
    weekly,
    setWeekly,
    daily,
    setDaily,
    setDeviceID,
    systemPermissionStatus,
    requestPermission,
  } = useContext(NotificationContext);

  /**
   * Saves user's notification preferences for breaking news and weekly summary alerts.
   * Also retrieves push token by using getPushToken and creates a device using createDevice
   */
  const saveNotifPreferences = async () => {
    requestPermission().then((status) => {
      setUpDevice(
        setBreaking,
        setWeekly,
        setDaily,
        status,
        breaking,
        weekly,
        daily
      ).then((id) => setDeviceID(id));
    });

    route.params.parentNav.push("MainApp");
  };

  console.log("breaking", breaking);
  console.log("weekly", weekly);
  console.log("daily", daily);

  return (
    <View style={{ ...baseStyles.container, marginTop: 40 }}>
      <Text style={text.bigTitle}>Welcome.</Text>
      <Text style={text.normal}>
        Turn on alerts for the topics that interest you and we'll keep you
        updated.
      </Text>
      <View style={{ rowGap: 16 }}>
        <Notif
          title="Breaking News"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          value={breaking}
          setValue={setBreaking}
          onboarding={true}
        />
        <Notif
          title="Weekly Summary"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          value={weekly}
          setValue={setWeekly}
          onboarding={true}
        />
        <Notif
          title="Daily Summary"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          value={daily}
          setValue={setDaily}
          onboarding={true}
        />
      </View>
      <TouchableOpacity
        style={settings.continueButton}
        onPress={saveNotifPreferences}
      >
        <Text style={text.sectionHeader1}>Save and continue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[settings.continueButton, { borderColor: "white" }]}
        onPress={() => {
          setUpDevice(setBreaking, setWeekly, setDaily, systemPermissionStatus)
            .then((id) => setDeviceID(id))
            .then(() => route.params.parentNav.push("MainApp"));
        }}
      >
        <Text style={text.normal}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PushNotifsScreen;
