import { Platform, StyleSheet } from "react-native";

export const font1 = "Georgia";
// export const font2 = "Roboto Flex";
// export const font3 = "Roboto Condensed";

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
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: font2,
  }, // sections
  seeMore: {
    fontWeight: "600",
    color: "#ED1C24",
    fontSize: 12,
    marginRight: 16,
    fontFamily: font2,
  },
  topStories: {
    color: "#000",
    fontWeight: "600",
    fontSize: 24,
    fontFamily: font2,
    marginBottom: 4,
  },
  sectionHeader2: {
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  }, // fyp header
  sectionHeader3: {
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 8,
  }, // fyp header
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

/**
 *
 * small card
 * - section RC 12, 500, 16
 * - title G 16, 700, 22
 * - author RF, 12, 500, 14
 * - date RC 12, 500, normal
 *
 * large card
 * - section RC 16, 500, normal
 * - title G 20, 700, 28
 * - author RF, 16, 500, 20
 * - date RC 14, 500, normal
 *
 * horz card
 * - section RC 12, 500, normal
 * - title G, 16, 700, 20
 * - author RF 12, 500, 14
 * - date RC 12, 500, normal
 *
 * menu bar
 * - RF 14, 500, normal
 * - selected is weight 600
 *
 * header with see more
 * - header RF 16, 600, normal
 * - see more RF 12, 600, normal (RED)
 *
 * top stories
 * - RF 24, 600, normal
 *
 * FY PAGE
 *
 * recommended text, featured story
 * - RF 14, 600, normal
 *
 * back from archive, stay updated, author name, trending, rec, todays pciks
 * - RF, 12, 600, normal
 *
 * text
 * - RF, 12 400 normal
 */

export const notifToggle = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
  },
});
