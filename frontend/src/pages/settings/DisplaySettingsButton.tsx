import { TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { text, varTextColor } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import DisplaySettings from "./DisplaySettings";
import { NavProp } from "src/types/navStacks";

function DisplaySettingsButton({navigation} : NavProp) {

    return(
        <TouchableOpacity
        // onPress={() => navigation.push("DisplaySettings")}
        onPress={() => navigation.navigate("DisplaySettings")}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
        width: "100%",
        paddingHorizontal: 12,
      }}
      accessible={true}
      accessibilityLabel={`Display settings button`}
      accessibilityHint={`Press to open display settings`}
      accessibilityRole="button"
    >
      <Text style={{ ...text.notifSmall, fontSize: 16 }}>Display Settings</Text>
      {/* <DisplaySettings navigation={navigation}></DisplaySettings> */}
      <Ionicons name="chevron-forward-outline" size={24} color={varTextColor} />
    </TouchableOpacity>
    );
} export default DisplaySettingsButton;