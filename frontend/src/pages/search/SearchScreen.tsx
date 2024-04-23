import { View, Text } from "react-native";
import { styles } from "../../styles/search";

function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.titleText}>Search</Text>
    </View>
  );
}

export default SearchScreen;
