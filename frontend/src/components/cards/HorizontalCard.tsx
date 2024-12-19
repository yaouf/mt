import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CardProps } from "src/types/navStacks";
import { font1, font3, varGray1, varTextColor } from "../../styles/styles";
import { formatDates } from "../../utils/formatDates";

function HorizontalCard({ article, navigation }: CardProps) {
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
      >
        <View style={styles.card}>
          <View style={styles.content}>
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: img_uri,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.text}>
              <View style={styles.innerText}>
                <Text
                  style={styles.title}
                  numberOfLines={4}
                  ellipsizeMode="tail"
                >
                  {article.headline}
                </Text>
                <Text style={styles.published}>
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

export default HorizontalCard;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    // width: 358,
    width: "100%",
    flexDirection: "column",
    flexShrink: 0,
    borderRadius: 0,
    backgroundColor: "#fff",
    // shadowColor: varTextColor,
    // shadowOffset: {
    //   width: 0,
    //   height: 1.497,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 29.949,
    overflow: "visible",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignSelf: "stretch",
  },
  imageWrapper: {
    // paddingTop: 35.893,
    // paddingRight: 21.133,
    // paddingBottom: 34.62,
    // paddingLeft: 24.38,
    flex: 1,
  },
  image: {
    height: 85,
    aspectRatio: 1,
  },
  text: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
  },
  innerText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
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

  section: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    // lineHeight: 1,
  },
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
  published: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    // lineHeight: "normal";
  },
  options: {
    width: 16,
    height: 16,
    flexShrink: 0,
  },
});
