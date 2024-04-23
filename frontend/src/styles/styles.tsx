import { Platform, StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export const notifToggle = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
  },
});

export const font1 = "Georgia";
// export const font2 = "Roboto Flex";
// export const font3 = "Roboto Condensed";

export const font2 = Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif";
export const font3 =
  Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-condensed";
