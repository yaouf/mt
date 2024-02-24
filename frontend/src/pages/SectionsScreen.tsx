import { View, Text } from "react-native";

/**
 * Page for sections
 *   - links to the different section pages
 *   - for links, see hamburger of current site
 *   - depending on design, might show some articles from each section too, like nyt
 *
 * @returns Sections screen
 */
function SectionsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Section nav!</Text>
    </View>
  );
}

export default SectionsScreen;
