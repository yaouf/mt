import React from "react";
import { Alert, Share, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { ArticleProps, ShareProps } from "../types/types";
import { baseStyles } from "../styles/styles";
import CustomButton from "./CustomButton";
import LargeCard from "./cards/LargeCard";
import HorizontalCard from "./cards/HorizontalCard";

const ShareFeature = ({ uri }: ShareProps) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Check out this article! " + uri,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <View>
      <CustomButton text={"Share this article!"} onPress={onShare} />
    </View>
  );
};

/**
 * Native component for articles. When click on article, will redirect to
 * this native article component instead of opening in the main webview
 *
 * @returns native Article component
 */
function Show_article({ route, navigation }: ArticleProps) {
  const { articleUrl } = route.params;

  // Define the function to determine whether to load the request or not
  const shouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url || "";

    if (url === "https://www.browndailyherald.com/") {
      // Do not load the URL, go to Home
      navigation.navigate("Home");
      return false;
    }
    // check if new url is an article, redirects to another article component
    else if (url.includes("/article/") && url !== articleUrl) {
      navigation.push("Article", { articleUrl: url });
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={baseStyles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: articleUrl }}
        style={baseStyles.webview}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
      />
      <ShareFeature uri={articleUrl} />
    </View>
  );
}

export default Show_article;
