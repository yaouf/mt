import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { settings } from "src/styles/pages";
import { baseStyles,darkStyles, layout, text, darkModeText, varGray1 } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { SavedContext } from "../MainTabNavigator";
import FavArticle from "./FavArticle";
import { useTheme } from "src/components/ThemeContext";

/* 
        onPress={() => {
          setAsync("savedArticles", JSON.stringify({})).then(() =>
            console.log("clear")
          );
         setSavedArticles({});
  */

function SavedArticlesPreview({ navigation }: NavProp) {
  const { savedArticles } = useContext(SavedContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const textStyle = isDarkMode ? darkModeText : text;
  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  return (
    <View style={containerStyle.container}>
      <Text style={{ ...textStyle.sectionHeader1, marginTop: 16 }}>
        Saved Articles
      </Text>
      {Object.keys(savedArticles).length > 0 ? (
        <View style={layout.vStack}>
          {Object.keys(savedArticles)
            .slice(0, 2)
            .map((uuid, i) => (
              <View style={{ marginTop: 10 }}>
                <FavArticle
                  slug={savedArticles[uuid].slug}
                  published_at={savedArticles[uuid].date}
                  navigation={navigation}
                  key={`saved-article-card-${i}`}
                />
              </View>
            ))}
          {Object.keys(savedArticles).length > 2 && (
            <TouchableOpacity
              onPress={() => navigation.push("SavedArticles")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <Text style={settings.smallHeading}>View all saved articles</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={16}
                color={varGray1}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={{ ...textStyle.normal, fontSize: 16, marginTop: 12 }}>
          No saved articles yet. Press the bookmark on an article to save it.
        </Text>
      )}
    </View>
  );
}

export default SavedArticlesPreview;
