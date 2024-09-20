import { StyleSheet } from "react-native";
import { varGray1 } from "./styles";

export const search = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  img: {
    width: "90%",
    height: "90%"
    },

  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F3F3",
    borderRadius: 4,
    height: 40,
    width: "100%",
    marginTop: 16,
  },

  searchText: {
    fontSize: 16,
    color: varGray1,
    flex: 1,
  },

  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    zIndex: 1, // places above WebView
  },

  text: {
    fontSize: 12,
    color: "black",
  },

  searchCancel: {
    color: "black",
    fontSize: 30,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "whitesmoke",
    borderRadius: 10,
  },
});
