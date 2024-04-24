import { View, Text, ScrollView } from "react-native";
import { FYstyles } from "src/styles/foryou";
import { Article } from "src/types/types";
import ImageCard from "src/components/cards/ImageCard";

type TodaysPicksProps = {
  data: Article[];
};

function TodaysPicks({ data }: TodaysPicksProps) {
  return (
    <View>
      <Text style={FYstyles.header}>TODAY'S PICKS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={FYstyles.hStack}>
          {data.map((article, index) => (
            <ImageCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TodaysPicks;
