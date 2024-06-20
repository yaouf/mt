import { View, Text } from "react-native";
import { styles } from "../../styles/search";
import { baseStyles } from "src/styles/styles";

function SearchScreen() {
  return (
    <View style={baseStyles.container}>
      <Text style={styles.titleText}>Search</Text>
    </View>
  );
}

export default SearchScreen;
