import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Article } from "../../types/types";
import { baseStyles } from "../../styles/styles";
import { dummyData } from "../../dummyData";
import SmallCard from "src/components/cards/SmallCard";
import SmallCardArticle from "src/components/cards/SmallCardArticle";
import SmallCardArticle2 from "src/components/cards/SmallCardArticle2";
import { shareArticle } from "src/components/cards/ShareArticle";
import { formatDates } from "src/components/cards/FormatDates";
import React from "react";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";

function ArticleScreen({ article }: Article) {
  function handleShare() {
    // shareArticle(uri);
  }

  function handleBookmark() {}

  function handleNotification() {}

  const source = {
    html: article.content,
  };

  const customHTMLElementModels = {
    a: HTMLElementModel.fromCustomModel({
      tagName: "a",
      mixedUAStyles: styles.hyperlink,
      contentModel: HTMLContentModel.textual,
    }),
  };

  function splitArticle() {
    var splitContent = source.html.split("\n");
    var char = "\n";
    if (splitContent.length == 1) {
      char = "</p><p>";
      splitContent = source.html.split("</p><p>");
    }
    if (splitContent.length >= 15) {
      const source1 = {
        html: "",
      };
      splitContent.map((val, index) => {
        if (index <= splitContent.length / 3) {
          source1.html += val + char;
        }
      });
      const source2 = {
        html: "",
      };
      splitContent.map((val, index) => {
        if (
          index > splitContent.length / 3 &&
          index <= (2 * splitContent.length) / 3
        ) {
          source2.html += val + char;
        }
      });
      const source3 = {
        html: "",
      };
      splitContent.map((val, index) => {
        if (index > (2 * splitContent.length) / 3) {
          source3.html += val + char;
        }
      });
      return (
        <View style={styles.articleBodyWrapper}>
          <View style={styles.articleBody}>
            <RenderHTML
              source={source1}
              baseStyle={styles.text}
              customHTMLElementModels={customHTMLElementModels}
            />

            {/* Advertisement block */}
            <View style={styles.advert}>
              <Image
                source={{
                  uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
                }}
                style={styles.adImage}
              />
              <Text style={styles.adAuthor}>Ad Author</Text>
            </View>

            {/* article continued */}
            <RenderHTML
              source={source2}
              baseStyle={styles.text}
              customHTMLElementModels={customHTMLElementModels}
            />

            {/* Advertisement block */}
            <View style={styles.advert}>
              <Image
                source={{
                  uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
                }}
                style={styles.adImage}
              />
              <Text style={styles.adAuthor}>Ad Author</Text>
            </View>

            {/* article continued */}
            <RenderHTML
              source={source3}
              baseStyle={styles.text}
              customHTMLElementModels={customHTMLElementModels}
            />
          </View>
        </View>
      );
    } else {
      const source1 = {
        html: "",
      };
      splitContent.map((val, index) => {
        if (index <= splitContent.length / 2) {
          source1.html += val + char;
        }
      });
      const source2 = {
        html: "",
      };
      splitContent.map((val, index) => {
        if (index > splitContent.length / 2) {
          source2.html += val + char;
        }
      });
      return (
        <View style={styles.articleBodyWrapper}>
          <View style={styles.articleBody}>
            <RenderHTML
              source={source1}
              baseStyle={styles.text}
              customHTMLElementModels={customHTMLElementModels}
            />

            {/* Advertisement block */}
            <View style={styles.advert}>
              <Image
                source={{
                  uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
                }}
                style={styles.adImage}
              />
              <Text style={styles.adAuthor}>Ad Author</Text>
            </View>

            {/* article continued */}
            <RenderHTML
              source={source2}
              baseStyle={styles.text}
              customHTMLElementModels={customHTMLElementModels}
            />
          </View>
        </View>
      );
    }
  }

  return (
    <ScrollView>
      {/* Overall container */}
      <View style={baseStyles.container}>
        {/* Header image */}
        <Image
          source={{
            uri:
              "https://snworksceo.imgix.net/bdh/" +
              article.dominantMedia.attachment_uuid +
              ".sized-1000x1000.jpg?w=1000",
          }}
          style={styles.image}
        />

        {/* Container for text, rest of article */}
        <View style={styles.container}>
          {/* Media caption, author */}
          <View style={styles.mediaDetails}>
            <Text style={styles.mediaCaption}>
              {article.dominantMedia.content}
            </Text>
            <Text style={styles.mediaAuthor}>
              {article.dominantMedia.authors.map(
                (mediaAuthor) => mediaAuthor.name
              )}
            </Text>
          </View>

          {/* Article title, lead, author, published date, section */}
          <View style={styles.articleHeading}>
            <Text style={styles.title}>{article.headline}</Text>
            <Text style={styles.lead}>{article.subhead}</Text>
            <Text style={styles.author}>
              {article.authors.map((author) => author.name)}
            </Text>

            {/* Published date, section */}
            <View style={styles.publishedDetails}>
              <Text style={styles.publishedDate}>
                {formatDates(article.published_at)}
              </Text>
              <Text style={styles.section}>{article.tags[0].name}</Text>
            </View>
          </View>

          {/* Article text */}
          {splitArticle()}
          {/* Read more section, with small cards */}
          <View style={styles.readMore}>
            <View style={styles.readMoreLine}></View>
            <Text style={styles.readMoreHeading}>Another Category</Text>
            <View style={styles.cardRow}>
              <SmallCardArticle2 article={dummyData[0]} />
              <SmallCardArticle2 article={dummyData[1]} />
            </View>
            <View style={styles.cardRow}>
              <SmallCardArticle2 article={dummyData[2]} />
              <SmallCardArticle2 article={dummyData[3]} />
            </View>
          </View>

          {/* Actions -  share, save, notifications*/}
          <View style={styles.actionBar}>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleNotification()}>
                <Image
                  source={require("../../../assets/notifications.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleBookmark()}>
                <Image
                  source={require("../../../assets/bookmarks.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare()}>
                <Image
                  source={require("../../../assets/share.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ArticleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: 390,
    backgroundColor: "#FFF",
    // height: 5849,
  },
  image: {
    display: "flex",
    width: 390,
    height: 253,
    flex: 1,
    paddingLeft: 162.282,
    paddingRight: 166.393,
    justifyContent: "flex-end",
    alignItems: "center",
    flexGrow: 0,
  },
  mediaDetails: {
    display: "flex",
    flexDirection: "column", // had to change from row to column, wasn't fitting
    alignItems: "flex-start",
    // gap: 11.134,
    marginBottom: 22,
  },
  mediaCaption: {
    color: "#9E9E9E",
    fontFamily: "Times New Roman",
    fontSize: 12.456,
    fontStyle: "normal",
    fontWeight: "400",
    // lineHeight: "normal",
  },
  mediaAuthor: {
    color: "#9E9E9E",
    fontFamily: "Times New Roman",
    fontSize: 12.456,
    fontStyle: "italic", // changed from normal to italic
    fontWeight: "400",
    // lineHeight: "normal",
  },
  articleHeading: {
    display: "flex",
    width: 358,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 7.422,
    marginBottom: 27,
  },
  title: {
    alignSelf: "stretch",
    color: "#000",
    fontFamily: "Georgia",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    // lineHeight: "normal",
  },
  lead: {
    alignSelf: "stretch",
    color: "#9E9E9E",
    fontFamily: "Georgia",
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "400",
    // lineHeight: "normal",
  },
  author: {
    color: "#000",
    fontFamily: "Roboto Flex",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "700",
    // lineHeight: "normal",
  },
  publishedDetails: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14.845,
    alignSelf: "stretch",
  },
  publishedDate: {
    color: "#9E9E9E",
    fontFamily: "Roboto Condensed",
    fontSize: 12.456,
    fontStyle: "normal",
    fontWeight: "400",
    // lineHeight: "normal",
  },
  section: {
    color: "#9E9E9E",
    fontFamily: "Roboto Condensed",
    fontSize: 12.456,
    fontStyle: "normal",
    fontWeight: "400",
    // lineHeight: "normal",
  },
  articleBodyWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  articleBody: {
    width: 358,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 36,
  },
  text: {
    color: "#000",
    fontFamily: "Times New Roman",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
  },
  hyperlink: {
    color: "#000",
    fontFamily: "Times New Roman",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
    textDecorationLine: "underline",
  },
  correction: {
    color: "#000",
    fontFamily: "Times New Roman",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 24,
  },
  advert: {
    width: 390,
    height: 280,
    flexShrink: 0,
    backgroundColor: "#F3F3F3",
    paddingTop: 36,
    paddingRight: 50,
    paddingBottom: 55,
    paddingLeft: 48,
  },
  adImage: {
    display: "flex",
    width: 292,
    height: 190,
    paddingTop: 65.219,
    paddingBottom: 63.457,
    paddingRight: 146.282,
    paddingLeft: 150.393,
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    backgroundColor: "#C9C9C9",
  },
  adAuthor: {
    color: "#9E9E9E",
    fontFamily: "Times New Roman",
    fontSize: 12.456,
    fontStyle: "normal",
    fontWeight: "400",
    // lineHeight: "normal",
  },
  readMore: {
    width: 358,
    height: 551.388,
  },
  readMoreLine: {
    width: 352,
    height: 1,
    backgroundColor: "#1C1B1F",
    marginBottom: 7.76,
  },
  readMoreHeading: {
    color: "#000",
    fontFamily: "Roboto Flex",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "600",
    // lineHeight: "normal",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 12,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    width: 390,
    padding: 16,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    height: 58,
    gap: 235,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

const tagsStyles = {
  body: {
    color: "#000",
    fontFamily: "Times New Roman",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
  },
  a: {
    color: "#000",
    fontFamily: "Times New Roman",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
    textDecorationLine: "underline",
  },
};
