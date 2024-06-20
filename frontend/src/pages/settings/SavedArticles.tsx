import { useContext, useRef, useState } from "react";
import { SavedContext } from "../Nav";
import { Text, View } from "react-native";
import CustomButton from "src/components/CustomButton";
import { setAsync } from "src/code/helpers";
import { NavProp } from "src/types/types";
import FavArticle from "./FavArticle";
import { layout } from "src/styles/styles";

function SavedArticles({ navigation }: NavProp) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);

  console.log("*********", savedArticles);
  console.log(Object.keys(savedArticles).length);

  return (
    <View>
      <Text>Saved Articles</Text>

      {/* // TODO: this is just for me for now */}
      <CustomButton
        text="clear"
        onPress={() => {
          setAsync("savedArticles", JSON.stringify({})).then(() =>
            console.log("clear")
          );
          setSavedArticles({});
        }}
      />

      {Object.keys(savedArticles).length > 0 ? (
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
      ) : (
        <Text>No Saved Articles</Text>
      )}
    </View>
  );
}

export default SavedArticles;
