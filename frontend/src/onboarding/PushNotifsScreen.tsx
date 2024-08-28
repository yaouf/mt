import { StackScreenProps } from "@react-navigation/stack";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Notif from "src/components/Notif";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { settings } from "src/styles/pages";
import { baseStyles, text } from "src/styles/styles";
import { OnboardParams } from "src/types/navStacks";
import { setUpDevice } from "../code/setup";

function PushNotifsScreen({
  route,
  navigation,
}: StackScreenProps<OnboardParams, "PushNotifs">) {
  const {
    breaking,
    setBreaking,
    universityNews,
    setUniversityNews,
    daily,
    setDaily,
    setDeviceID,
    systemPermissionStatus,
    requestPermission,
  } = useContext(NotificationContext);

  /**
   * Saves user's notification preferences for breaking news and universityNews summary alerts.
   * Also retrieves push token by using getPushToken and creates a device using createDevice
   */
  const saveNotifPreferences = async () => {
    requestPermission().then((status) => {
      setUpDevice(
        setBreaking,
        setUniversityNews,
        setDaily,
        status,
        breaking,
        universityNews,
        daily
      ).then((id) => setDeviceID(id));
    });

    route.params.parentNav.push("MainApp");
  };

  console.log("breaking", breaking);
  console.log("universityNews", universityNews);
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
          title="University News"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
          value={universityNews}
          setValue={setUniversityNews}
          onboarding={true}
        />
        <Notif
          title="Metro"
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
          setUpDevice(setBreaking, setUniversityNews, setDaily, systemPermissionStatus)
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
