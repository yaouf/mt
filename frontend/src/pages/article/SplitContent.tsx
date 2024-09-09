import { View, Image, Text } from "react-native";
import { articleStyles } from "src/styles/article";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Article } from "src/types/data";
import { Dispatch, SetStateAction, useState } from "react";
import { fetchArticle } from "src/code/fetchContent";
import WebView from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import React from "react"; // Import React for memo

type SplitArticleType = {
  content: string;
};

function SplitArticle({ content }: SplitArticleType) {
  const source = {
    html: content,
  };

  const [article, setArticle] = useState<Article | undefined>();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const customHTMLElementModels = {
    iframe: HTMLElementModel.fromCustomModel({
      tagName: "iframe",
      mixedUAStyles: {
        width: "100%",
      },
      contentModel: HTMLContentModel.textual,
    }),
    a: HTMLElementModel.fromCustomModel({
      tagName: "a",
      mixedUAStyles: articleStyles.hyperlink,
      contentModel: HTMLContentModel.textual,
    }),
  };

  const handleLinkPress = async (
    event: any,
    href: string,
    setArticle: Dispatch<SetStateAction<Article | undefined>>
  ) => {
    const articleBaseURL = "https://www.browndailyherald.com/article/";
    if (href.startsWith(articleBaseURL)) {
      try {
        const seg = href.split("/");
        const slug = seg.pop();
        const month = seg.pop();
        const year = seg.pop();
        const date = year + "-" + month;

        if (!slug || !year || !month) {
          throw new Error("Invalid URL format");
        }

        const fetchedArticle = await fetchArticle(slug, date, setArticle);
        setArticle(fetchedArticle);
        navigation.push("Article", { data: fetchedArticle });
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    } else {
      await WebBrowser.openBrowserAsync(href);
    }
  };

  const IframeRenderer = React.memo(
    ({ tnode }: any) => {
      const { attributes } = tnode;
      const src = attributes.src;
      const height = parseInt(attributes.height) || 500;

      return (
        <WebView
          source={{ uri: src }}
          style={{
            marginVertical: 20,
            width: "100%",
            height: height,
          }}
          scrollEnabled={false}
        />
      );
    },
    (prevProps, nextProps) => {
      // Prevent re-render if the source URL of the iframe hasn't changed
      return prevProps.tnode.attributes.src === nextProps.tnode.attributes.src;
    }
  );

  // Split content by paragraphs
  let splitContent = source.html.split("\n");
  if (splitContent.length === 1) {
    splitContent = source.html.split("</p><p>");
  }

  const toSplitBy = "\n";
  const adFrequency = 7; // Advertisement every 7 paragraphs after the first ad
  const firstAdPosition = 5; // First ad after the 5th paragraph

  // Insert placeholders for ads directly into splitContent
  for (let i = firstAdPosition; i < splitContent.length; i += adFrequency + 1) {
    splitContent.splice(i, 0, "<!-- ADVERTISEMENT_PLACEHOLDER -->");
  }

  // Function to render ads as components
  const renderAdComponent = () => (
    <View style={articleStyles.advert}>
      <Image
        source={{
          uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
        }}
        style={articleStyles.adImage}
      />
      <Text style={articleStyles.adAuthor}>Advertisement</Text>
    </View>
  );

  // Render content with ads inserted at placeholder positions
  return (
    <View style={articleStyles.articleBodyWrapper}>
      <View style={articleStyles.articleBody}>
        {splitContent.map((paragraph, index) => {
          if (paragraph === "<!-- ADVERTISEMENT_PLACEHOLDER -->") {
            // Render ad component when encountering placeholder
            return <View key={`ad-${index}`}>{renderAdComponent()}</View>;
          }

          // Render normal paragraph content
          return (
            <RenderHTML
              key={`para-${index}`}
              source={{ html: paragraph + toSplitBy }}
              baseStyle={articleStyles.text}
              customHTMLElementModels={customHTMLElementModels}
              renderers={{ iframe: IframeRenderer }}
              renderersProps={{
                a: {
                  onPress: (event, href) => handleLinkPress(event, href, setArticle),
                },
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export default SplitArticle;
