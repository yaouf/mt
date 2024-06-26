import { View, Text, ScrollView } from "react-native";
import { Article } from "src/types/data";
import ImageCard from "src/components/cards/ImageCard";
import { layout, text } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";

type TodaysPicksProps = {
  data: Article[];
  navigation: StackNavigationProp<any, any>;
};

function TodaysPicks({ data, navigation }: TodaysPicksProps) {
  return (
    <View>
      <Text style={text.sectionHeader3}>TODAY'S PICKS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={layout.hStack}>
          {data.map((article, i) => (
            <ImageCard
              key={`fyp-picks-${i}`}
              article={article}
              navigation={navigation}
            /> // Ensure SmallCard expects a prop named 'article'
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TodaysPicks;
