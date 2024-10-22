import * as Notifications from "expo-notifications";
import { Dispatch, SetStateAction, useContext } from "react";
import { Alert, Linking, Switch, Text, View } from "react-native";
import { setAsync } from "src/code/helpers";
import { updateSettings } from "src/code/serverlessAPIs";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { fyp } from "src/styles/pages";
import { text } from "src/styles/styles";

type NotifProps = {
  title: string;
  description: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  onboarding?: boolean;
  asyncName?: string;
};

function Notif({
  title,
  description,
  value,
  setValue,
  onboarding,
  asyncName,
}: NotifProps) {
  const {
    systemPermissionStatus,
    setSystemPermissionStatus,
    requestPermission,
    deviceID,
  } = useContext(NotificationContext);

  const updateBackend = (newVal: boolean) => {
    try {
      if (asyncName === "breakingNotifs") {
        updateSettings(deviceID, newVal, undefined, undefined);
      } else if (asyncName === "universityNewsNotifs") {
        updateSettings(deviceID, undefined, newVal, undefined);
      } else if (asyncName === "metroNotifs") {
        updateSettings(deviceID, undefined, undefined, newVal);
      }
    } catch (error) {
      console.log("error updating settings", error);
    }
  };

  const toggle = async () => {
    if (onboarding) {
      setValue((previousState: boolean) => !previousState);
    } else {
      // update system permission status (on device and in backend)
      if (systemPermissionStatus === "granted") {
        updateBackend(!value); // TODO: is this the right value even if toggle quickly??
        setValue((previousState: boolean) => !previousState);
        setAsync(asyncName as string, JSON.stringify(!value));
      } else if (systemPermissionStatus === "denied") {
        Alert.alert(
          "Enable Notifications",
          "To enable notifications, please go to Settings and turn on notifications for this app.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("cancel"),
              style: "cancel",
            },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        // don't update background here because system settings is disallowed
      } else {
        console.log("if of undetermined"); // (said maybe later in settings)
        await requestPermission();
        const { status } = await Notifications.getPermissionsAsync();
        if (status === "granted") {
          console.log("in true");
          setValue(true);
          setAsync(asyncName as string, "true");
          updateBackend(!value);
        }
        setSystemPermissionStatus(status);
      }

      // TODO: updateNotifStatus
    }
  };

  const toggleValue = onboarding
    ? value
    : systemPermissionStatus === "granted" && value;

  return (
    <View style={fyp.toggleRow}>
      <View style={{flex: 1}}>
        <Text style={text.sectionHeader3}>{title}</Text>
        <Text style={text.notifSmall} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
      <Switch
        trackColor={{ true: "#000000", false: "grey" }}
        value={toggleValue}
        onValueChange={() => toggle()}
        accessibilityLabel={`${title} notifications`}
        accessibilityHint={`Toggle to enable or disable ${title} notifications`}
        accessibilityRole="switch"
        accessibilityState={{ checked: toggleValue }}
      />
    </View>
  );
}

export default Notif;
