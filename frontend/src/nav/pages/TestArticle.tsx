import { View, Text } from "react-native";
import ArticleScreen from "./ArticleScreen";
import { dummyData } from "src/dummyData";
import React from "react";

/**
 * for you page!!
 *
 * @returns for you screen
 */
function TestArticleScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ArticleScreen article={dummyData[0]} />
    </View>
  );
}

export default TestArticleScreen;
