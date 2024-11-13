import { useEffect, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { Tag } from "src/types/data";
import { CardProps } from "src/types/navStacks";
import { formatDates } from "src/utils/formatDates";
import {
  font1,
  font2,
  font3,
  varGray1,
  varRed,
  varTextColor,
} from "../../styles/styles";

function SearchCard({ article, navigation }: CardProps) {
  const { fontScale } = useWindowDimensions();
  const all_tags = article.tags?.map((t: Tag) => t.name) || [];
  let breaking = false;

  for (let i = 0; i < all_tags.length; i++) {
    if (all_tags[i] == "breaking") {
      breaking = true;
    }
  }

  let img_uri =
    "https://d35jcxe8no8yhr.cloudfront.net/1054f24d72785fb7b6a4e1283656e2ab/dist/img/placeholder-4x3.png";
  if (article.dominantMedia.attachment_uuid) {
    img_uri =
      "https://snworksceo.imgix.net/bdh/" +
      article.dominantMedia.attachment_uuid +
      ".sized-1000x1000." +
      article.dominantMedia.extension;
  }

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    console.log(height);
  };

  const SUBHEADER_LINES = 4;
  const TITLE_LINES = 3;
  const INITIAL_CARD_HEIGHT = 400;
  const [cardHeight, setCardHeight] = useState(INITIAL_CARD_HEIGHT);

  useEffect(() => {
    console.log("fontScale", fontScale);
    // Adjust height calculation based on fontScale
    const scaledHeight = INITIAL_CARD_HEIGHT * fontScale;
    console.log("newHeight", scaledHeight);
    if (scaledHeight !== cardHeight) {
      setCardHeight(scaledHeight);
    }
  }, [fontScale]); // Add fontScale as a dependency

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => navigation.push("Article", { data: article })}
        accessibilityRole="button"
        accessibilityHint={`Double tap to open article`}
      >
        <View
          style={[styles.card, { height: cardHeight }]}
          onLayout={onLayoutHandler}
        >
          <Image
            source={{
              uri: img_uri,
            }}
            style={styles.image}
          />
          <View style={styles.bottomTextArea}>
            <View style={styles.titlesContainer}>
              {breaking ? (
                <View
                  style={styles.breakingBox}
                  accessibilityLabel="Section: Breaking News."
                >
                  <Text style={styles.breaking}>Breaking News</Text>
                </View>
              ) : (
                <Text
                  style={styles.section}
                  accessibilityLabel={`Section: ${all_tags[0].replace(
                    "&;",
                    "&"
                  )}.`}
                >
                  {all_tags[0].replace("&;", "&")}
                </Text>
              )}
              <Text
                style={styles.title}
                accessibilityLabel={`Headline: ${article.headline}.`}
                numberOfLines={Math.floor(
                  TITLE_LINES * 1.2 * Math.sqrt(fontScale)
                )}
                ellipsizeMode="tail"
              >
                {article.headline}
              </Text>
              <Text
                style={styles.subhead}
                numberOfLines={Math.floor(
                  SUBHEADER_LINES * 1.2 * Math.sqrt(fontScale)
                )}
                ellipsizeMode="tail"
                accessibilityLabel={`Subtitle: ${article.subhead}`}
              >
                {article.subhead}
              </Text>
            </View>
            <View style={styles.bottom}>
              <View style={styles.publishedSection}>
                <Text
                  style={styles.published}
                  accessibilityLabel={`Published on ${formatDates(
                    article.published_at
                  )}`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatDates(article.published_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default SearchCard;

const styles = StyleSheet.create({
  title: {
    alignSelf: "stretch",
    overflow: "hidden",
    flexWrap: "nowrap",
    fontFamily: font1,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 18,
  },
  subhead: {
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12,
  },
  card: {
    display: "flex",
    width: "100%",
    paddingBottom: 0,
    flexDirection: "column",
    alignItems: "stretch",
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    // height: cardHeight,
    // shadow looks bad
    // shadowColor: varTextColor,
    // shadowOffset: {
    //   width: 0,
    //   height: 1.497,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 29.949,
    // elevation: 3,
    marginTop: 16,
    overflow: "hidden",
    // marginVertical: 12,
  },
  section: {
    color: varRed,
    fontFamily: font3,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginBottom: 5,
    /* lineHeight: 'normal',*/
  },
  published: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    /* line-height: normal; */
  },
  image: {
    backgroundColor: "#C9C9C9",
    display: "flex",
    height: 150,
    aspectRatio: 2 / 1,
    width: "100%",
    paddingTop: 59.893,
    paddingBottom: 58.055,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  bottomTextArea: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 4,
  },
  bottom: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "stretch",
  },
  titlesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 6,
  },
  publishedSection: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  options: {
    width: 23.959,
    height: 23.959,
  },
  breaking: {
    color: "#FFF",
    fontFamily: font2,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "600",
    // line-height: normal;
    textTransform: "uppercase",
  },
  breakingBox: {
    display: "flex",
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.661,
    borderStyle: "solid",
    borderColor: "#ED1C24",
    backgroundColor: "#ED1C24",
  },
});
