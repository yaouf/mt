import { useContext } from "react";
import { FlatList, View } from "react-native";
import { baseStyles } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { SavedContext } from "../BottomNavigator";
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
        style={{height: "100%"}}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
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
