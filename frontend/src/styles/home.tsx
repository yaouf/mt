import { StyleSheet } from "react-native";
import { font2 } from "./styles";

export const homeStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
  },
  vstack: {
    marginTop: 16,
    rowGap: 16,
  },
  top: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
    fontFamily: font2,
  },
});
