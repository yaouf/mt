import { StyleSheet } from "react-native";
import { font1, font2, font3, varGray1, varTextColor } from "./styles";

export const menuStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomColor: "black",
    borderBottomWidth: 5,
  },
  rowItem: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: varGray1,
    marginBottom: 12,
  },
  icon: {
    marginRight: 16,
    marginLeft: 16,
  },
  rowText: {
    flex: 1, // takes up remaining space
    color: varTextColor,
    fontWeight: "400", // TODO: figma says 500 but this font is thicker
    fontSize: 16,
    fontFamily: font2,
    textTransform: "uppercase",
  },
  otherText: {
    color: varTextColor,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: font2,
  },
  reset: {
    justifyContent: "center",
    height: 43,
    marginTop: 4,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase",
    fontFamily: font2,
    color: varGray1,
  },
  menuItemSelected: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase",
    fontFamily: font2,
    color: varTextColor,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
