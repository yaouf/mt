import { View } from "react-native";
import { baseStyles } from "src/styles/styles";
import Search from "./Search";
import { NavProp } from "src/types/navStacks";

function SearchScreen({ navigation }: NavProp) {
  console.log("___", navigation);
  return (
    <View style={baseStyles.container}>
      <Search navigation={navigation} />
    </View>
  );
}

export default SearchScreen;
