import { View, Text } from "react-native";

/**
 * Page for search (separate page just for now)
 *   - native search component
 *   - text entry and submit sends a call to https://www.browndailyherald.com/search?a=1&o=date&s=<search-input>
 *       - how to get json response??
 *   - render search results (or display search webview results for now)
 *
 * @returns Search screen
 */
function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Search!</Text>
    </View>
  );
}

export default SearchScreen;
