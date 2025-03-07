import { TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { text, darkModeText, varTextColor } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "src/components/ThemeContext";

type SettingsLinkProps = {
  title: string;
  link: string;
  inApp?: boolean;
  navigation?: StackNavigationProp<any, any>;
  extraProps?:{
    isDarkMode?: boolean;
    toggleTheme?: () => void;
  };
};

// const layout = StyleSheet.create({})

function SettingsLink({ title, link, inApp, navigation}: SettingsLinkProps) {
  const openLink = async (link: string) => {
    if (inApp && navigation) {
      navigation.navigate(link);
    } else {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await WebBrowser.openBrowserAsync(link);
      } else {
        console.error("Don't know how to open URI: " + link);
      }
    }
  };
  const { isDarkMode, toggleTheme } = useTheme();
  const textStyle = isDarkMode ? darkModeText : text;
  return (
    <TouchableOpacity
      onPress={() => openLink(link)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 12, // because 4 in the other padding
      }}
      accessible={true}
      accessibilityLabel={`${title} link`}
      accessibilityHint={`Press to open ${title} link`}
      accessibilityRole="button"
    >
      <Text style={{ ...textStyle.notifSmall, fontSize: 16 }}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color={textStyle.sectionHeader1.color} />
    </TouchableOpacity>
  );
}

export default SettingsLink;
