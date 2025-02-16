import { View } from "react-native";
import { NavProp } from "src/types/navStacks";
import Crossword from "./Crossword";

function GamesScreen({ navigation }: NavProp) {
  return (
    <View style={{ flex: 1 }}>
      <Crossword navigation={navigation} />
    </View>
  );
}

export default GamesScreen;
