import { View, Text } from "react-native";
import { Article } from "src/types/types";
import SmallCard from "src/components/cards/SmallCard";
import { layout, text } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";

type RecommendedProps = {
  data: Article[];
  navigation: StackNavigationProp<any, any>;
};

function Recommended({ data, navigation }: RecommendedProps) {
  return (
    <View>
      <Text style={text.sectionHeader3}>RECOMMENDED</Text>
      <View style={layout.grid}>
        {data.map((article, i) => (
          <SmallCard
            key={`fyp-rec-${i}`}
            article={article}
            navigation={navigation}
          />
        ))}
      </View>
    </View>
  );
}

export default Recommended;
