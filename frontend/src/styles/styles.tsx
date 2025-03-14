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

// to use in place of black
export const varTextColor = "#020202";
export const darkModeTextColor = "#ffffff";
export const varTextSecondaryColor = "#333";
export const darkTextSecondaryColor = "#e8e8e8";
export const varRed = "#ED1C24";
export const varGray1 = "#9E9E9E";
export const darkModeBackgroundColor = "1F1F1F";

export const baseStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    // flex: 1,
  },
  // container: {
  //   flex: 1,
  // },
  // webview: {
  //   flex: 1,
  // },
});
export const darkStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#1F1F1F",
  },
});

/**
 * layout styles
 */
export const layout = StyleSheet.create({
  hStack: { flexDirection: "row", columnGap: 16 },
  vStack: {
    rowGap: 0,
    marginTop: 0,
    overflow: "visible"
  },
  recentArticlesStack: {
    rowGap: 10,
    marginTop: 0,
    overflow: "visible"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    justifyContent: "space-between",
    rowGap: 0,
    marginTop: 0,
    overflow: "visible",
  },
});

/**
 * text styles
 */
export const text = StyleSheet.create({
  sectionHeader1: {
    // main section headers
    color: varTextColor,
    fontWeight: "800",
    fontSize: 26,
    fontFamily: font3,
    paddingTop: 10
  },
  resetSectionsButton: {
    // main section headers
    color: varTextColor,
    fontWeight: "800",
    fontSize: 20,
    fontFamily: font3,
    paddingTop: 0
  },
  sectionHeader2: {
    // with added padding for settings
    color: varTextColor,
    fontWeight: "800",
    fontSize: 20,
    fontFamily: font1,
  },

  seeMore: {
    // see more header for section
    fontWeight: "600",
    color: varRed,
    fontSize: 12,
    marginRight: 16,
    fontFamily: font2,
  },
  bigTitle: {
    // top stories is a slightly larger title
    color: varTextColor,
    fontWeight: "600",
    fontSize: 24,
    fontFamily: font2,
    marginBottom: 4,
    marginTop: 20,
  },
  sectionHeader3: {
    // like back from archive, stay updated on fyp
    color: varTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  notifSmall: {
    color: varTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    overflow: "hidden",
    maxWidth: "100%",
    paddingRight: 10
  },
  normal: {
    color: varTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
  },
  textSmall: {
    color: varTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
  },
  textMedium: {
    color: varTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
  },
});

export const darkModeText = StyleSheet.create({
  sectionHeader1: {
    // main section headers
    color: darkModeTextColor,
    fontWeight: "800",
    fontSize: 26,
    fontFamily: font3,
    paddingTop: 10
  },
  resetSectionsButton: {
    // main section headers
    color: darkModeTextColor,
    fontWeight: "800",
    fontSize: 20,
    fontFamily: font3,
    paddingTop: 0
  },
  sectionHeader2: {
    // with added padding for settings
    color: darkModeTextColor,
    fontWeight: "800",
    fontSize: 20,
    fontFamily: font1,
  },

  seeMore: {
    // see more header for section
    fontWeight: "600",
    color: varRed,
    fontSize: 12,
    marginRight: 16,
    fontFamily: font2,
  },
  bigTitle: {
    // top stories is a slightly larger title
    color: darkModeTextColor,
    fontWeight: "600",
    fontSize: 24,
    fontFamily: font2,
    marginBottom: 4,
    marginTop: 20,
  },
  sectionHeader3: {
    // like back from archive, stay updated on fyp
    color: darkModeTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  notifSmall: {
    color: darkModeTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    overflow: "hidden",
    maxWidth: "100%",
    paddingRight: 10
  },
  normal: {
    color: darkModeTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
  },
  textSmall: {
    color: darkModeTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
  },
  textMedium: {
    color: darkModeTextColor,
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
  },
});

export const settingsText = StyleSheet.create({
  title: {
    ...text.sectionHeader1,
    fontSize: 24,
  },
  description: {
    ...text.normal,
    fontSize: 18,
  },
  // ... other styles ...
});
