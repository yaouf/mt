import { TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { text, varTextColor } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";


function DisplaySettings() {

    return(
        <TouchableOpacity
    //   onPress={() => openLink(link)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
        width: "100%",
        paddingHorizontal: 12, // because 4 in the other padding
      }}
      accessible={true}
      accessibilityLabel={`Display settings button`}
      accessibilityHint={`Press to open display settings`}
      accessibilityRole="button"
    >
      <Text style={{ ...text.notifSmall, fontSize: 16 }}>Display Settings</Text>
      <Ionicons name="chevron-forward-outline" size={24} color={varTextColor} />
    </TouchableOpacity>
    );
} export default DisplaySettings;