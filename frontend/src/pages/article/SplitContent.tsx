import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";
import WebView from "react-native-webview";
import { fetchArticle } from "src/api/fetchContent";
import { articleStyles } from "src/styles/article";
import { Article } from "src/types/data";

// const adUnitId = __DEV__
//   ? TestIds.BANNER
//   : "ca-app-pub-8731315434789018/9601202667";

const IframeRenderer = React.memo(
  ({ tnode }: any) => {
    const [iframeHeight, setIframeHeight] = useState(1);
    const webViewRef = useRef(null);

    const { src } = useMemo(() => {
      const { attributes } = tnode;
      return { src: attributes.src };
    }, [tnode.attributes.src]);

    const onWebViewMessage = useCallback((event) => {
      const height = parseInt(event.nativeEvent.data);
      if (!isNaN(height)) {
        setIframeHeight(height);
      }
    }, []);

    const injectedJavaScript = `
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
      true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
      <WebView
        ref={webViewRef}
        source={{ uri: src }}
        style={[styles.webView, { height: iframeHeight }]}
        scrollEnabled={false}
        onMessage={onWebViewMessage}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={() => {
          webViewRef.current?.injectJavaScript(injectedJavaScript);
        }}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.tnode.attributes.src === nextProps.tnode.attributes.src
);

type SplitArticleType = {
  content: string;
};

function SplitArticle({ content }: SplitArticleType) {
  const source = {
    html: content,
  };

  const [article, setArticle] = useState<Article | undefined>();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const customHTMLElementModels = useMemo(
    () => ({
      iframe: HTMLElementModel.fromCustomModel({
        tagName: "iframe",
        mixedUAStyles: {
          width: "100%",
        },
        contentModel: HTMLContentModel.block,
      }),
      a: HTMLElementModel.fromCustomModel({
        tagName: "a",
        mixedUAStyles: articleStyles.hyperlink,
        contentModel: HTMLContentModel.textual,
      }),
    }),
    []
  );

  const handleLinkPress = useCallback(
    async (event: any, href: string) => {
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
    },
    [navigation]
  );

  const renderers = useMemo(() => ({ iframe: IframeRenderer }), []);
  const renderersProps = useMemo(
    () => ({
      a: {
        onPress: handleLinkPress,
      },
    }),
    [handleLinkPress]
  );

  // Split content by paragraphs
  const splitContent = useMemo(() => {
    let split = source.html.split("\n");
    if (split.length === 1) {
      split = source.html.split("</p><p>");
    }

    const adFrequency = 7; // Advertisement every 7 paragraphs after the first ad
    const firstAdPosition = 5; // First ad after the 5th paragraph

    // Insert placeholders for ads
    for (let i = firstAdPosition; i < split.length; i += adFrequency + 1) {
      split.splice(i, 0, "<!-- ADVERTISEMENT_PLACEHOLDER -->");
    }

    return split;
  }, [source.html]);

  // Function to render ads as components
  const renderAdComponent = useCallback(
    () => (
      <View style={articleStyles.advert}>
        {/* <Image
        source={{
          uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
        }}
        style={articleStyles.adImage}
      /> */}
        <Text style={articleStyles.adText}>Advertisement</Text>
      </View>
    ),
    []
  );

  // Render content with ads inserted at placeholder positions
  return (
    <View style={articleStyles.articleBodyWrapper}>
      <View style={articleStyles.articleBody}>
        {splitContent.map((paragraph, index) => {
          if (paragraph === "<!-- ADVERTISEMENT_PLACEHOLDER -->") {
            return <View key={`ad-${index}`}>{renderAdComponent()}</View>;
          }
          // Render normal paragraph content
          return (
              <RenderHTML
                key={`para-${index}`}
                source={{ html: paragraph + "\n" }}
                baseStyle={articleStyles.text}
                customHTMLElementModels={customHTMLElementModels}
                renderers={renderers}
                renderersProps={renderersProps}
                GenericPressable={View}
                defaultTextProps={{selectable:true}}
              />
          );
        })}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webView: {
    width: "100%",
    marginVertical: 10,
  },
});

export default React.memo(SplitArticle);
