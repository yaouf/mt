import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { fetchArticle } from "src/code/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { Article } from "src/types/types";

type FavArticleProps = {
  slug: string;
  published_at: string;
  navigation: StackNavigationProp<any, any>;
};

function FavArticle(props: FavArticleProps) {
  const [article, setArticle] = useState<Article | undefined>();

  useEffect(() => {
    fetchArticle(props.slug, props.published_at, setArticle).then(() =>
      console.log("loaded content")
    );
  }, []);

  if (!article) {
    return <Text>Loading!</Text>;
  }

  return (
    <HorizontalCard
      article={article}
      navigation={props.navigation}
      key={`saved-${props.slug}`}
    />
  );
}

export default FavArticle;
