import { View } from "react-native";
import Search from "./Search";
import { NavProp } from "src/types/navStacks";

function SearchScreen({ navigation }: NavProp) {
  return (
    <View 
      style={{ flex: 1 }}
    >
      <Search navigation={navigation} />
    </View>
  );
}

export default SearchScreen;
