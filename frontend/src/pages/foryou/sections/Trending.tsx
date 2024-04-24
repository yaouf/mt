import { ScrollView, Text, View } from "react-native";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { FYstyles } from "src/styles/foryou";
import { Article } from "src/types/types";

type TrendingProps = {
  data: Article[];
};

function Trending({ data }: TrendingProps) {
  const handleSeeMorePress = () => {
    // Navigation that is to be performed on 'See more' press button
    console.log("See more pressed!");
  };

  return (
    <View>
      <View>
        <Text style={FYstyles.header}>TRENDING</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={FYstyles.vStack}>
            {data.map((article, index) => (
              <HorizontalCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default Trending;
