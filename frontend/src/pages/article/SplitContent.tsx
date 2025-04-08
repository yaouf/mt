import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";
import {
  HTMLContentModel,
  HTMLElementModel,
  MixedStyleDeclaration,
  RenderHTML,
} from 'react-native-render-html';
import WebView from 'react-native-webview';
import { fetchArticle } from 'src/api/fetchContent';
import { articleStyles, fontsizeHeader } from 'src/styles/article';
import { font2, varTextSecondaryColor } from 'src/styles/styles';
import { Article } from 'src/types/data';

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
  (prevProps, nextProps) => prevProps.tnode.attributes.src === nextProps.tnode.attributes.src
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
        tagName: 'iframe',
        mixedUAStyles: {
          width: '100%',
        },
        contentModel: HTMLContentModel.block,
      }),
      a: HTMLElementModel.fromCustomModel({
        tagName: 'a',
        mixedUAStyles: articleStyles.hyperlink,
        contentModel: HTMLContentModel.textual,
      }),
      div: HTMLElementModel.fromCustomModel({
        tagName: 'div',
        contentModel: HTMLContentModel.block,
      }),
    }),
    []
  );

  const handleLinkPress = useCallback(
    async (event: any, href: string) => {
      const articleBaseURL = 'https://www.browndailyherald.com/article/';
      if (href.startsWith(articleBaseURL)) {
        try {
          const seg = href.split('/');
          const slug = seg.pop();
          const month = seg.pop();
          const year = seg.pop();
          const date = year + '-' + month;

          if (!slug || !year || !month) {
            throw new Error('Invalid URL format');
          }

          const fetchedArticle = await fetchArticle(slug, date, setArticle);
          setArticle(fetchedArticle);
          navigation.push('Article', { data: fetchedArticle });
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      } else {
        await WebBrowser.openBrowserAsync(href);
      }
    },
    [navigation]
  );

  const renderers = useMemo(
    () => ({
      iframe: IframeRenderer,
      div: (props) => {
        const { tnode } = props;
        const isLiveUpdate = tnode.classes?.includes('live-update');
        const isLiveHeader = tnode.classes?.includes('header-container');
        const isLiveEntry = tnode.classes?.includes('live-container');
        // console.log(tnode);
        if (isLiveUpdate) {
          return (
            <View style={styles.liveUpdateContainer}>
              {/* <Text style={styles.liveLabel}>LIVE UPDATE</Text> */}
              <props.TDefaultRenderer {...props} />
            </View>
          );
        } else if (isLiveHeader) {
          console.log(tnode.value);
          return (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
              <props.TDefaultRenderer
                {...props}
                source={{ html: tnode.value }}
                // contentWidth={300}
                customHTMLElementModels={customHTMLElementModels}
                renderers={renderers}
              />
            </View>
          );
        }
        // else if (isLiveEntry) {
        //   return (
        //     <View style={styles.liveEntryContainer}>
        //       <View style={styles.liveEntryHeader}>
        //         <Text style={styles.liveLabel}>LIVE ENTRY</Text>
        //       </View>
        //       <props.TDefaultRenderer {...props} />
        //     </View>
        //   );
        // }
        return <props.TDefaultRenderer {...props} />;
      },
    }),
    []
  );

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
    let split = source.html.split('\n');
    if (split.length === 1) {
      split = source.html.split('</p><p>');
    }

    const adFrequency = 7; // Advertisement every 7 paragraphs after the first ad
    const firstAdPosition = 5; // First ad after the 5th paragraph

    // Insert placeholders for ads
    // for (let i = firstAdPosition; i < split.length; i += adFrequency + 1) {
    //   split.splice(i, 0, '<!-- ADVERTISEMENT_PLACEHOLDER -->');
    // }

    if (!source.html.includes('live-entry')) return split;

    const liveEntryRegex =
      /(<div class="live-entry"[^>]*>.*?\.\s*<\/div>\s*<\/div>|<p>.*?Live coverage by:*.?<\/p>|<div[^>].*?<i><b.*?>What you need to know:.*?<\/div>)/gs;

    split = source.html.split(liveEntryRegex).map((section) => {
      console.log(section);
      if (section.includes('What you need to know:')) {
        return `<div class="live-update">${section}</div>`;
      } else if (section.includes('<div class="live-entry"')) {
        const noImagesInLiveEntry = section.replace(/<img[^>]*>/g, '');
        return `<div class="live-container">${noImagesInLiveEntry}</div>`;
        // return `<div class="live-container">${section}</div>`;
      }
      if (section.includes('<img')) {
        return `<div class="header-container">${section}</div>`;
      }
      return section;
    });

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
          // if (paragraph === '<!-- ADVERTISEMENT_PLACEHOLDER -->') {
          //   return <View key={`ad-${index}`}>{renderAdComponent()}</View>;
          // }
          // Render normal paragraph content
          return (
            <RenderHTML
              key={`para-${index}`}
              source={{ html: paragraph + '\n' }}
              baseStyle={articleStyles.text}
              customHTMLElementModels={customHTMLElementModels}
              enableCSSInlineProcessing={false}
              renderers={renderers}
              renderersProps={renderersProps}
              GenericPressable={View}
              defaultTextProps={{ selectable: true }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webView: {
    width: '100%',
    marginVertical: 10,
  },
  liveUpdateContainer: {
    backgroundColor: '#efefef',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
  liveLabel: {
    color: '#EC2027',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveEntryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  liveEntryContainer: {
    backgroundColor: '#fef2f2',
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#EC2027',
    marginVertical: 8,
    borderRadius: 4,
  },
});

export default SplitArticle;
