import { View, Text } from "react-native";
import LargeCard from "src/components/cards/LargeCard";
import { FYstyles } from "src/styles/foryou";
import { Article } from "src/types/types";

type ArchiveProps = {
  date: string;
  article: Article;
};

function Archive({ date, article }: ArchiveProps) {
  return (
    <View>
      <Text style={FYstyles.header}>BACK FROM THE ARCHIVE</Text>
      <Text style={FYstyles.introtext}>
        A featured story from this day __ years ago
      </Text>
      <LargeCard article={article}></LargeCard>
    </View>
  );
}

export default Archive;
