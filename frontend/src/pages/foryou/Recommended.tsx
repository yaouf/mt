import { View, Text } from "react-native";
import { FYstyles } from "src/styles/foryou";
import { Article } from "src/types/types";
import SmallCard from "src/components/cards/SmallCard";

type RecommendedProps = {
  data: Article[];
};

function Recommended({ data }: RecommendedProps) {
  return (
    <View>
      <Text style={FYstyles.header}>RECOMMENDED</Text>
      <View style={FYstyles.grid}>
        {data.map((article, index) => (
          <SmallCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
        ))}
      </View>
    </View>
  );
}

export default Recommended;
