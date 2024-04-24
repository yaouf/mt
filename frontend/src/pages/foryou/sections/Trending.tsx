import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, Text, View } from "react-native";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { layout, text } from "src/styles/styles";
import { Article, NavProp } from "src/types/types";

type TrendingProps = {
  data: Article[];
  navigation: StackNavigationProp<any, any>;
};

function Trending({ data, navigation }: TrendingProps) {
  return (
    <View>
      <View>
        <Text style={text.sectionHeader3}>TRENDING</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={layout.vStack}>
            {data.map((article, index) => (
              <HorizontalCard
                key={index}
                article={article}
                navigation={navigation}
              /> // Ensure SmallCard expects a prop named 'article'
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default Trending;
