import { Dispatch, SetStateAction, useContext } from "react";
import { View, Text, Switch, Alert, Linking } from "react-native";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { fyp } from "src/styles/pages";
import { text } from "src/styles/styles";
import * as Notifications from "expo-notifications";
import { setAsync } from "src/code/helpers";

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
  } = useContext(NotificationContext);

  const toggle = async () => {
    if (onboarding) {
      setValue((previousState: boolean) => !previousState);
    } else {
      if (systemPermissionStatus === "granted") {
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
        // TODO: update backend  -- not sure if i want to do it here or where the settings are checked in notif provider
      } else {
        console.log("if of undetermined");
        // said maybe later in settings
        await requestPermission();
        const { status } = await Notifications.getPermissionsAsync();
        if (status === "granted") {
          setValue(true);
          setAsync(asyncName as string, "true");
          // TODO: update backend (just for granted, bc undetermined and denied are both false)
        }
        setSystemPermissionStatus(status);
      }
    }
  };

  const toggleValue = onboarding
    ? value
    : systemPermissionStatus === "granted" && value;

  return (
    <View style={fyp.toggleRow}>
      <View>
        <Text style={text.sectionHeader3}>{title}</Text>
        <Text style={text.notifSmall} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
      <Switch value={toggleValue} onValueChange={() => toggle()} />
    </View>
  );
}

export default Notif;
