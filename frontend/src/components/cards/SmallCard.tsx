import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from "react-native";
import { CardProps } from "src/types/navStacks";
import { Author } from "src/types/data";
import { shortFormatDates } from "../../code/formatDates";
import {
  font1,
  font2,
  font3,
  varTextColor,
  varGray1,
} from "../../styles/styles";
import ShowContextMenu from "./ShowContextMenu";

function SmallCard({ article, navigation, specialWidth }: CardProps) {
  // let cardStyles: StyleProp<ViewStyle> = {
  //   ...styles.card,
  //   ...{ width: "48%" },
  // };
  // if (specialWidth !== undefined) {
  //   // @ts-ignore
  //   cardStyles = { ...styles.card, ...{ width: specialWidth } };
  // }

  let cardSize: StyleProp<ViewStyle> = { width: "48%" };
  if (specialWidth !== undefined) {
    cardSize = { width: specialWidth };
  }

  let img_uri =
    "https://d35jcxe8no8yhr.cloudfront.net/1054f24d72785fb7b6a4e1283656e2ab/dist/img/placeholder-4x3.png";
  if (article.dominantMedia.attachment_uuid) {
    img_uri =
      "http://snworksceo.imgix.net/bdh/" +
      article.dominantMedia.attachment_uuid +
      ".sized-1000x1000." +
      article.dominantMedia.extension;
  }

  return (
    <View style={cardSize}>
      <TouchableWithoutFeedback
        style={styles2.touchableItem}
        onPress={() => navigation.push("Article", { data: article })}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: img_uri,
            }}
            style={styles.image}
          />
          <View style={styles.text}>
            <Text style={styles.section}>
              {" "}
              {article.tags[0].name.replace("&;", "&")}
            </Text>
            <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">
              {article.headline}
            </Text>
            <Text style={styles.author}>
              {article.authors.map((a: Author) => a.name).join(", ")}
            </Text>
            <View style={styles.bottom}>
              <View style={styles.publishedSection}>
                <Text style={styles.published}>
                  {shortFormatDates(article.published_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ShowContextMenu
        published_at={article.published_at}
        slug={article.slug}
        uuid={article.uuid}
      />
    </View>
  );
}

export default SmallCard;

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableItem: {
    width: 200,
    height: 200,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  showContextButton: {
    position: "absolute",
    bottom: 10, // Adjust as per your requirement
    right: 10, // Adjust as per your requirement
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
  },
});

const styles = StyleSheet.create({
  title: {
    height: 60,
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  author: {
    color: varTextColor,
    fontFamily: font2,
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 14,
  },
  card: {
    display: "flex",
    // width: 170,
    // width: "48%",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 8,
    backgroundColor: "#FFF",
    shadowColor: varTextColor,
    shadowOffset: {
      width: 0,
      height: 1.497,
    },
    shadowOpacity: 0.08,
    shadowRadius: 29.949,
    elevation: 3,
    overflow: "visible",
  },
  section: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 10,
    fontStyle: "normal",
    // fontWeight: "500",
    /* lineHeight: 'normal',*/
  },
  published: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 10,
    fontStyle: "normal",
    // fontWeight: "500",
    /* line-height: normal; */
  },
  image: {
    backgroundColor: "#C9C9C9",
    display: "flex",
    height: 111.815,
    width: "100%",
    paddingTop: 39.997,
    paddingBottom: 38.769,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderTopLeftRadius: 7.487,
    borderTopRightRadius: 7.487,
  },
  text: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
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
  contextMenu: {
    display: "flex",
    width: 254,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "absolute",
    right: 3,
    top: -42,
    borderRadius: 12,
    elevation: Platform.OS === "android" ? 8 : 0,
    shadowColor: varTextColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 64,
  },
  option: {
    backgroundColor: "rgba(237, 237, 237, 0.80)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    paddingVertical: 11,
    paddingHorizontal: 16,
    padding: 8,
    fontSize: 16,
    borderBottomColor: "rgba(60, 60, 67, 0.36)",
    borderBottomWidth: 0.5,
  },
  publishedSection: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  options: {
    width: 16,
    height: 16,
  },
  line: {
    width: 254,
    height: 0.5,
    backgroundColor: "rgba(60, 60, 67, 0.36)",
  },
});
