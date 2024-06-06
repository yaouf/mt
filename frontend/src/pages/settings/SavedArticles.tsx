import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { SavedContext } from "../Nav";
import { layout } from "src/styles/styles";
import { Text, View } from "react-native";

function SavedArticles() {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);

  return (
    <View style={layout.vStack}>
      <Text>Saved Articles</Text>
      {savedArticles.map(
        (
          uuid: string,
          i // rest as horizontal
        ) => (
          <Text key={uuid}>{uuid}</Text>
          // <HorizontalCard
          //   article={article}
          //   navigation={navigation}
          //   key={`opinions-home-${i + 2}`}
          // />
        )
      )}
    </View>
  );
}

export default SavedArticles;
