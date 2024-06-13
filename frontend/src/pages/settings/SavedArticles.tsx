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
  const [saved, setSaved] = useState(savedArticles);

  console.log("*********", savedArticles);

  return (
    <View>
      <Text>Saved Articles</Text>
      <CustomButton
        text="clear"
        onPress={() => {
          setAsync("savedArticles", JSON.stringify({})).then(() =>
            console.log("clear")
          );
          setSavedArticles({});
        }}
      />

      <View style={layout.vStack}>
        {Object.keys(saved).map((uuid) => (
          <FavArticle
            slug={saved[uuid][0]}
            published_at={saved[uuid][1]}
            navigation={navigation}
          />
        ))}
      </View>
    </View>
  );
}

export default SavedArticles;
