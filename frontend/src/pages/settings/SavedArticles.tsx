import { useContext } from "react";
import { View, FlatList } from "react-native";
import { baseStyles, layout } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { SavedContext } from "../Nav";
import FavArticle from "./FavArticle";

function SavedArticles({ navigation }: NavProp) {
  const { savedArticles } = useContext(SavedContext);
  const savedArticleArray = Object.keys(savedArticles).map((uuid) => ({
    id: uuid,
    slug: savedArticles[uuid].slug,
    published_at: savedArticles[uuid].date,
  }));

  return (
    <View style={baseStyles.container}>
      <FlatList
        data={savedArticleArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavArticle
            slug={item.slug}
            published_at={item.published_at}
            navigation={navigation}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default SavedArticles;
