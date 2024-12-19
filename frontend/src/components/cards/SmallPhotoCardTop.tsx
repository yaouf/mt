import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Tag } from "src/types/data";
import { CardProps } from "src/types/navStacks";
import {
  font1,
  font3,
  varGray1,
  varRed,
  varTextColor,
} from "../../styles/styles";
import { formatDates } from "../../utils/formatDates";

function LargeCard({ article, navigation }: CardProps) {
  const all_tags = article.tags.map((t: Tag) => t.name);

  let img_uri =
    "https://d35jcxe8no8yhr.cloudfront.net/1054f24d72785fb7b6a4e1283656e2ab/dist/img/placeholder-4x3.png";
  if (article.dominantMedia) {
    img_uri =
      "https://snworksceo.imgix.net/bdh/" +
      article.dominantMedia.attachment_uuid +
      ".sized-1000x1000." +
      article.dominantMedia.extension;
  }

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => navigation.push("Article", { data: article })}
        accessibilityRole="button"
        accessibilityHint={`Double tap to open article`}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: img_uri,
            }}
            style={styles.image}
          />
          <View style={styles.text}>
            <Text
              style={styles.section}
              accessibilityLabel={`Section: ${all_tags[0].replace("&;", "&")}.`}
            >
              {all_tags[0].replace("&;", "&")}
            </Text>
            <Text
              style={styles.title}
              accessibilityLabel={`Headline: ${article.headline}.`}
            >
              {article.headline}
            </Text>
            <View style={styles.bottom}>
              <View style={styles.publishedSection}>
                <Text
                  style={styles.published}
                  accessibilityLabel={`Published on ${formatDates(
                    article.published_at
                  )}.`}
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

export default LargeCard;

const styles = StyleSheet.create({
  title: {
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 8,
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
    paddingBottom: 8,
    flexDirection: "column",
    alignItems: "stretch",
    borderRadius: 0,
    backgroundColor: "#FFF",
    // shadowColor: varTextColor,
    // shadowOffset: {
    //   width: 0,
    //   height: 1.497,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 29.949,
    // elevation: 3,
    marginTop: 16,
    overflow: "visible",
    // marginVertical: 12,
  },
  section: {
    color: varRed,
    fontFamily: font3,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
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
    height: 250,
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
  text: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 0,
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 4,
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
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
});
