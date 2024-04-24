import { StyleSheet } from "react-native";
import { font2 } from "./styles";

export const FYstyles = StyleSheet.create({
  hStack: { flexDirection: "row", columnGap: 16 },
  introtext: {
    color: "#000",
    fontFamily: font2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  header: {
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 16,
    marginLeft: 16,
  },
  vStack: {
    rowGap: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
    columnGap: 16,
  },
});
