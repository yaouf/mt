import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { font1, font2, font3, text, varTextSecondaryColor } from 'src/styles/styles';
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

type LiveEntryHeader = {
  image: string;
  name: string;
  title: string;
  date: string;
  slug: string;
  section: string;
};

type BylineSlugs = {
  [name: string]: string;
};

function SplitArticle({ content }: SplitArticleType) {
  const source = {
    html: content,
  };

  const [article, setArticle] = useState<Article | undefined>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [parsedHeaders, setParsedHeaders] = useState<LiveEntryHeader[]>([]);
  const [bylineAuthors, setBylineAuthors] = useState<{ name: string; slug: string }[]>([]);

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
        const isLiveEntry = tnode.classes?.includes('live-container');
        const isByline = tnode.classes?.includes('byline');
        if (isLiveUpdate) {
          console.log('hello there');
          return (
            <View style={styles.liveUpdateContainer}>
              {/* <Text style={styles.liveLabel}>LIVE UPDATE</Text> */}
              <props.TDefaultRenderer {...props} />
            </View>
          );
        } else if (isLiveEntry) {
          const headerIndex = Number(tnode.attributes['data-index'] ?? '0');
          return (
            <View style={styles.liveEntryContainer}>
              {/* <Text style={styles.liveLabel}>LIVE ENTRY</Text> */}
              {parsedHeaders[headerIndex] && renderHeader(parsedHeaders[headerIndex])}
              {/* <props.TDefaultRenderer {...props} /> */}
            </View>
          );
        } else if (isByline) {
          // return <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}></Text>;
          return renderByline();
        }
        return <props.TDefaultRenderer {...props} />;
      },
      img: (props) => {
        const { tnode } = props;
        const src = tnode.attributes?.src;

        // Check if parent is <a> with href
        const parentLink = tnode.parent?.tagName === 'a' ? tnode.parent.attributes?.href : null;

        if (!src) return null;

        if (parentLink) {
          return (
            <TouchableOpacity
              onPress={() => handleLinkPress(null, parentLink)}
              style={{ marginVertical: 10 }}
              accessible={true}
              accessibilityHint="View linked image content"
            >
              <Image
                source={{ uri: src }}
                style={{ width: '100%', height: 200, resizeMode: 'cover' }}
              />
            </TouchableOpacity>
          );
        }
      },
      ul: (props) => {
        return <View style={{ paddingLeft: 20, marginVertical: 8 }}>{props.tnode.children}</View>;
      },
      li: (props) => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
            <Text style={{ fontSize: 18, lineHeight: 24, paddingHorizontal: 5 }}>
              {'\u2022' + ' '}
            </Text>
            <View style={{ flex: 1 }}>
              <props.TDefaultRenderer {...props} />
            </View>
          </View>
        );
      },
    }),
    [parsedHeaders]
  );

  function renderHeader(header: LiveEntryHeader) {
    if (header) {
      return (
        <View style={articleStyles.authorRow}>
          {header.image && header.slug && (
            <View style={[articleStyles.authorImagesContainer, { flexShrink: 1 }]}>
              <TouchableOpacity
                key={header.slug}
                onPress={() => {
                  console.log('Navigating to Staff with slug:', header.slug);
                  navigation.navigate('Staff', { slug: header.slug });
                }}
                accessible={true}
                accessibilityHint="View Author's Profile"
              >
                <Image source={{ uri: header.image }} style={articleStyles.authorImage} />
              </TouchableOpacity>
            </View>
          )}
          {header.image && !header.slug && (
            <View style={[articleStyles.authorImagesContainer, { flexShrink: 1 }]}>
              <Image source={{ uri: header.image }} style={articleStyles.authorImage} />
            </View>
          )}
          <View style={[articleStyles.authorTextContainer, { flexShrink: 1, width: '60%' }]}>
            {header.name && header.slug && (
              <TouchableOpacity
                key={header.slug}
                onPress={() => {
                  console.log('Navigating to Staff with slug:', header.slug);
                  navigation.navigate('Staff', { slug: header.slug });
                }}
                accessible={true}
                accessibilityHint="View Author's Profile"
              >
                <Text style={articleStyles.author}>{header.name}</Text>
              </TouchableOpacity>
            )}
            {header.name && !header.slug && (
              <Text style={[articleStyles.author, { fontSize: 18, fontStyle: 'italic' }]}>
                {header.name}
              </Text>
            )}
            {header.title && (
              <Text
                style={[articleStyles.publishedDetailsText, { color: font2, fontStyle: 'italic' }]}
              >
                {header.title}
              </Text>
            )}
          </View>
          {header.date && (
            <View style={(articleStyles.publishedDetails, styles.liveEntryHeaderPublished)}>
              <Text style={[articleStyles.publishedDetailsText, { fontSize: 12 }]}>
                {header.date}
              </Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  }

  function renderByline() {
    if (!bylineAuthors.length) return null;

    const elements: React.ReactNode[] = [];

    bylineAuthors.forEach((author, index) => {
      const isLast = index === bylineAuthors.length - 1;
      const isSecondToLast = index === bylineAuthors.length - 2;

      elements.push(
        <TouchableOpacity
          key={author.slug}
          onPress={() => {
            console.log('Navigating to Staff with slug:', author.slug);
            navigation.navigate('Staff', { slug: author.slug });
          }}
          accessible={true}
          accessibilityHint="View Author's Profile"
        >
          <Text style={[styles.bylineStyle, { textDecorationLine: 'underline' }]}>
            {author.name}
          </Text>
        </TouchableOpacity>
      );

      if (!isLast) {
        elements.push(
          <Text key={`separator-${index}`} style={styles.bylineStyle}>
            {isSecondToLast ? ' and ' : ', '}
          </Text>
        );
      }
    });

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        <Text style={styles.bylineStyle}>Live coverage by </Text>
        {elements}
      </View>
    );
  }

  const renderersProps = useMemo(
    () => ({
      a: {
        onPress: handleLinkPress,
      },
    }),
    [handleLinkPress]
  );

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
      /(<div class="live-entry"[^>]*>.*?\.\s*<\/div>\s*<\/div>|<b><i>.*?Live coverage by:*.?<\/i><\/b>|<div[^>].*?<i><b.*?>What you need to know:.*?<\/div>)/gs;

    let headerCount = 0;

    split = source.html.split(liveEntryRegex).map((section) => {
      console.log(section);
      if (
        section.includes('What you need to know:') ||
        section.includes('The latest of what you need to know:')
      ) {
        return `<div class="live-update">${section}</div>`;
      } else if (section.includes('Live coverage by')) {
        parseByLine(section);
        return `<div class="byline">${section}</div>`;
      } else if (section.includes('<div class="live-entry"')) {
        setParsedHeaders((prevHeaders) => [...prevHeaders, parseLiveHeader(section)]);
        let returnVal = `<div class="live-container" data-index="${headerCount}">${section}</div>`;
        headerCount++;
        return returnVal;
      }
      return section;
    });

    return split;
  }, [source.html]);

  function extractSlugsFromByline(content: string): string[] {
    const regex = /<a href="https:\/\/www\.browndailyherald\.com\/staff\/([\w-]+)"/g;
    return Array.from(content.matchAll(regex)).map((match) => match[1]);
  }

  function parseByLine(content: string) {
    const regex =
      /<a href="https:\/\/www\.browndailyherald\.com\/staff\/([\w-]+)"[^>]*>(.*?)<\/a>/g;
    const matches = Array.from(content.matchAll(regex));
    setBylineAuthors(
      matches.map(([_, slug, name]) => ({
        name,
        slug,
      }))
    );
  }

  const imageRegex = /<img[^>]*src="([^"]*)"[^>]*>/g;
  const nameRegex = /<div class="live-author-name"[^>]*>\s*<b>(.*?)<\/b>\s*<\/div>/gs;
  const roleRegex = /<div class="live-author-title"[^>]*>\s*(.*?)\s*<\/div>/s;
  const dateRegex = /<div class="live-time-date">\s*([^<]+)\s*<\/div>/g;
  const slugRegex = /https:\/\/www\.browndailyherald\.com\/staff\/([\w-]+)/g;

  function parseLiveHeader(content: string): LiveEntryHeader {
    const authorNameMatch = new RegExp(nameRegex).exec(content);
    const entryNameMatch = new RegExp(
      /<div class="live-author-name"[^>]*>\s*<i><b>(.*?)<\/b><\/i>\s*<\/div>/gs
    ).exec(content);
    const nameMatch = authorNameMatch
      ? authorNameMatch[1].replace(/<\/?[b|i]>/g, '').trim()
      : entryNameMatch
        ? entryNameMatch[1]
        : null;
    const authorTitleMatch = content.match(roleRegex);
    const titleMatch = authorTitleMatch
      ? authorTitleMatch[1]
          .replace(/<\/?(i|a)(\s[^>]*)?>/g, '')
          .replace('&amp;', '&')
          .trim()
      : null;
    const dateMatch = new RegExp(dateRegex).exec(content);
    let slugMatch;
    if (!authorNameMatch && nameMatch) {
      slugMatch = '';
    } else {
      slugMatch = [...content.matchAll(slugRegex)].map((match) => match[1])[0];
    }
    let imageMatch;
    let images = [];
    while ((imageMatch = imageRegex.exec(content)) !== null) {
      const match = imageMatch[1];
      images.push(match);
    }

    const header: LiveEntryHeader = {
      image: images ? images[0] : '',
      name: nameMatch ? nameMatch : '',
      title: titleMatch ? titleMatch : '',
      date: dateMatch ? dateMatch[1] : '',
      slug: slugMatch ? slugMatch : '',
      section: content.replace(imageRegex, ''),
    };

    return header;
  }

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

  return (
    <View style={articleStyles.articleBodyWrapper}>
      <View style={articleStyles.articleBody}>
        {splitContent.map((paragraph, index) => {
          // if (paragraph === '<!-- ADVERTISEMENT_PLACEHOLDER -->') {
          //   return <View key={`ad-${index}`}>{renderAdComponent()}</View>;
          // }
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
    display: 'flex',
    // marginBottom: 12,
  },
  liveEntryContainer: {
    // backgroundColor: '#fef2f2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 0,
    // borderLeftWidth: 4,
    // borderLeftColor: '#EC2027',
    marginVertical: 8,
    borderRadius: 4,
  },
  liveEntryHeaderPublished: {
    flexDirection: 'column',
    gap: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    // width: '25%',
    paddingLeft: 10,
  },
  bylineStyle: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: font1,
  },
});

export default SplitArticle;
