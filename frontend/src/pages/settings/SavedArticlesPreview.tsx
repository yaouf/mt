import { useContext, useRef, useState } from "react";
import { SavedContext } from "../Nav";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { setAsync } from "src/code/helpers";
import { NavProp } from "src/types/navStacks";
import FavArticle from "./FavArticle";
import { baseStyles, layout, text, varGray1 } from "src/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { settings } from "src/styles/pages";

/* 
        onPress={() => {
          setAsync("savedArticles", JSON.stringify({})).then(() =>
            console.log("clear")
          );
         setSavedArticles({});
  */

function SavedArticlesPreview({ navigation }: NavProp) {
  const { savedArticles } = useContext(SavedContext);

  return (
    <View style={baseStyles.container}>
      <Text style={{ ...text.sectionHeader1, marginTop: 16 }}>
        Saved Articles
      </Text>
      {Object.keys(savedArticles).length > 0 ? (
        <View style={layout.vStack}>
          {Object.keys(savedArticles)
            .slice(0, 2)
            .map((uuid, i) => (
              <FavArticle
                slug={savedArticles[uuid].slug}
                published_at={savedArticles[uuid].date}
                navigation={navigation}
                key={`saved-article-card-${i}`}
              />
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
        <Text style={{ ...text.normal, fontSize: 14, marginTop: 12 }}>
          No saved articles yet. Press the bookmark on an article to save it.
        </Text>
      )}
    </View>
  );
}

export default SavedArticlesPreview;
