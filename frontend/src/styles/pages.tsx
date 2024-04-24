import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const fyp = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 16,
    marginLeft: 16,
  },
  horzScrollCard: {
    maxWidth: windowWidth * 0.5,
  },
});

export const home = StyleSheet.create({});

// add any more pages here

export const settings = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
  },
});
