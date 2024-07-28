import { useContext } from "react";
import { View } from "react-native";
import { baseStyles, layout } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { SavedContext } from "../Nav";
import FavArticle from "./FavArticle";

function SavedArticles({ navigation }: NavProp) {
  const { savedArticles } = useContext(SavedContext);
  return (
    <View style={baseStyles.container}>
      <View style={layout.vStack}>
        {Object.keys(savedArticles).map((uuid, i) => (
          <FavArticle
            slug={savedArticles[uuid].slug}
            published_at={savedArticles[uuid].date}
            navigation={navigation}
            key={`saved-article-card-${i}`}
          />
        ))}
      </View>
    </View>
  );
}

export default SavedArticles;
