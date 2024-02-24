import { View, Text } from "react-native";

/**
 * When click on article, will redirect to this native article component
 * instead of opening in webview
 * 
 * Will integrate into webview redirect and add smooth transitions
 * 
 * @returns native Article component
 */
function Article() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Article native component!</Text>
    </View>
  );
}

export default Article;
