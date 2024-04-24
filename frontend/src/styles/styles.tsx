import { Platform, StyleSheet } from "react-native";

/**
 * file for base styles, fonts, layouts, text, etc
 */

export const font1 = "Georgia";
// export const font2 = "Roboto Flex";
// export const font3 = "Roboto Condensed";

// for now until load fonts:
export const font2 = Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif";
export const font3 =
  Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-condensed";

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

/**
 * layout styles
 */
export const layout = StyleSheet.create({
  hStack: { flexDirection: "row", columnGap: 16 },
  vStack: {
    marginTop: 16,
    rowGap: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    justifyContent: "space-between",
    rowGap: 16,
  },
});

/**
 * text styles
 */
export const text = StyleSheet.create({
  sectionHeader1: {
    // main section headers
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: font2,
  },
  seeMore: {
    // see more header for section
    fontWeight: "600",
    color: "#ED1C24",
    fontSize: 12,
    marginRight: 16,
    fontFamily: font2,
  },
  topStories: {
    // top stories is a slightly larger title
    color: "#000",
    fontWeight: "600",
    fontSize: 24,
    fontFamily: font2,
    marginBottom: 4,
  },
  sectionHeader2: {
    // like recommended text, featured story on fyp
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeader3: {
    // like back from archive, stay updated on fyp
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  text: {
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
    overflow: "hidden",
    maxWidth: "85%",
  },
});
