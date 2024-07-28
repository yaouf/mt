import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { font2, varGray1 } from "./styles";

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
  continueButton: {
    height: 45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: varGray1,
    marginVertical: 4,
  },
  smallHeading: {
    color: varGray1,
    fontFamily: font2,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
