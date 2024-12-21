import { useContext } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { baseStyles, text } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { SavedContext } from "../MainTabNavigator";
import BottomSavedArticlesBar from "./BottomSavedArticlesBar";
import FavArticle from "./FavArticle";

/**
 * Page that displays all saved articles
 */
function SavedArticles({ navigation }: NavProp) {
  const { savedArticles } = useContext(SavedContext);
  const savedArticleArray = Object.keys(savedArticles).map((uuid) => ({
    id: uuid,
    slug: savedArticles[uuid].slug,
    published_at: savedArticles[uuid].date,
  }));

  return (
    <SafeAreaView style={[baseStyles.container, { flex: 1 }]}>
      <View style={[baseStyles.container, { flex: 1 }]}>
        <Text style={{ ...text.sectionHeader1, paddingBottom: 15 }}>
          Saved Articles
        </Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={savedArticleArray}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
        <BottomSavedArticlesBar />
      </View>
    </SafeAreaView>
  );
}

export default SavedArticles;
