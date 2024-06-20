import { TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { text } from "src/styles/styles";

type SettingsLinkProps = {
  title: string;
  link: string;
};

// const layout = StyleSheet.create({})

function SettingsLink({ title, link }: SettingsLinkProps) {
  const openLink = async (link: string) => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
      console.error("Don't know how to open URI: " + link);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => openLink(link)}
      onLongPress={() => openLink(link)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Text style={{ ...text.textSmall, fontSize: 14 }}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default SettingsLink;
