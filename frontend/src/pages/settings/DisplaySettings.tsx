import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fyp } from "src/styles/pages";
import { settings } from "src/styles/pages";
import { NavProp, SearchStackProps } from "src/types/navStacks";
import { text, varTextColor } from "src/styles/styles";

//Screen for display settings

function DisplaySettings({navigation} : NavProp) {
  // const {
  //   searchType,
  //   setSearchType,
  //   selectedSections,
  //   setSelectedSections,
  //   sortType,
  //   setSortType,
  // } = route.params;
  // const [searchMode, setSearchMode] = useState(searchType);
  // const [sortOption, setSortOption] = useState(sortType);

  // useEffect(() => {
  //   setSearchType(searchMode);
  //   console.log("after searchMode:", searchMode);
  //   console.log("after searchType:", searchType);
  // }, [searchMode, searchType]);

  // useEffect(() => {
  //   setSortType(sortOption);
  //   console.log("after searchMode:", sortOption);
  //   console.log("after searchType:", sortType);
  // }, [sortOption, sortType]);
  // const toggleValue = onboarding
  //   ? value
  //   : systemPermissionStatus === "granted" && value;
  const toggleValue = true;

  const toggle = async () => {
      // if (onboarding) {
      //   console.log("calling setState in onboarding toggle", !value);
        // setValue((previousState: boolean) => !previousState);
      // } else {
      //   // update system permission status (on device and in backend)
      //   if (systemPermissionStatus === "granted") {
      //     console.log("new value in toggle", !value);
      //     const newValue = !value;
      //     setValue(newValue);
      //     setAsync(asyncName as string, JSON.stringify(newValue));
      //     updateBackend(newValue); // TODO: is this the right value even if toggle quickly??
      //   } else if (systemPermissionStatus === "denied") {
      //     Alert.alert(
      //       "Enable Notifications",
      //       "To enable notifications, please go to Settings and turn on notifications for this app.",
      //       [
      //         {
      //           text: "Cancel",
      //           onPress: () => console.log("cancel"),
      //           style: "cancel",
      //         },
      //         { text: "Open Settings", onPress: () => Linking.openSettings() },
      //       ]
      //     );
      //     // don't update background here because system settings is disallowed
      //   } else {
      //     console.log("if of undetermined"); // (said maybe later in settings)
      //     await requestPermission();
      //     const { status } = await Notifications.getPermissionsAsync();
      //     if (status === "granted") {
      //       console.log("in true");
      //       setValue(true);
      //       setAsync(asyncName as string, "true");
      //       updateBackend(!value);
      //     }
      //     setSystemPermissionStatus(status);
      //   }
  
        // TODO: updateNotifStatus
      //}
    };

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <Text style={text.sectionHeader1}>Display Settings</Text>
        <View style={{ rowGap: 16, marginTop: 4 }}>
        <Text style={settings.smallHeading }>Appearance</Text>
        <View style={fyp.toggleRow}>
              <View style={{ flex: 1, paddingRight: 64 }}>
                <Text style={text.sectionHeader3}>Automatic</Text>
              </View>
              <Switch
                trackColor={{ true: "#000000", false: "grey" }}
                value={toggleValue}
                onValueChange={() => toggle()}
                accessibilityLabel={`Automatic display setting`}
                accessibilityHint={`Toggle to enable or disable automatic display mode`}
                accessibilityRole="switch"
                accessibilityState={{ checked: toggleValue }}
              />
            </View>
            </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    paddingTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  backButton: {
    marginTop: 15,
    marginLeft: 15,
  },
});

export default DisplaySettings;
