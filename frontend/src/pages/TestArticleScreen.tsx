import { View, Text } from "react-native";
import { dummyData } from "src/dummyData";
import ArticleComponent from "src/pages/article/ArticleScreen";

/**
 * example article screen just for testing
 */
function TestArticleScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ArticleComponent article={dummyData[0]} />
    </View>
  );
}

export default TestArticleScreen;
