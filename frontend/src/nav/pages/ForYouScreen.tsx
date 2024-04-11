import { View } from "react-native";
import SmallCard from "src/components/cards/SmallCard";
import { dummyData } from "src/dummyData";

function ForYouSreen() {
  return (
    <View>
      <SmallCard article={dummyData[0]} />
    </View>
  );
}

export default ForYouSreen;
