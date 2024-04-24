import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text } from "react-native";
import LargeCard from "src/components/cards/LargeCard";
import { text } from "src/styles/styles";
import { Article } from "src/types/types";

type ArchiveProps = {
  date: string;
  article: Article;
  navigation: StackNavigationProp<any, any>;
};

function Archive({ date, article, navigation }: ArchiveProps) {
  return (
    <View>
      <Text style={text.sectionHeader3}>BACK FROM THE ARCHIVE</Text>
      <Text style={text.sectionHeader2}>
        A featured story from this day __ years ago
      </Text>
      <LargeCard article={article} navigation={navigation} />
    </View>
  );
}

export default Archive;
