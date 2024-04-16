import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { showContextMenu } from "./ShowContextMenu";
import { Article, Author } from "src/types/types";
import { formatDates, shortFormatDates } from "../../code/formatDates";

function SmallCard({ article }: Article) {
  const uri = "https://www.browndailyherald.com/" + article.uuid;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            "http://snworksceo.imgix.net/bdh/" +
            article.dominantMedia.attachment_uuid +
            ".sized-1000x1000.jpg",
        }}
        style={styles.image}
      />
      <View style={styles.text}>
        <Text style={styles.section}>{article.tags[0].name}</Text>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
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
          <TouchableWithoutFeedback
            onPress={() => showContextMenu(uri)}
            onLongPress={() => showContextMenu(uri)}
          >
            <Image
              source={require("../../../assets/options.png")}
              style={styles.options}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

export default SmallCard;

const styles = StyleSheet.create({
  title: {
    height: 40,
    alignSelf: "stretch",
    color: "#000",
    fontFamily: "Georgia",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  author: {
    color: "#000",
    fontFamily: "Roboto Flex",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 14,
  },
  card: {
    display: "flex",
    width: 171,
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 8,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.497,
    },
    shadowOpacity: 0.08,
    shadowRadius: 29.949,
    elevation: 3,
  },
  section: {
    color: "#9E9E9E",
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 10,
    fontStyle: "normal",
    // fontWeight: "500",
    /* lineHeight: 'normal',*/
  },
  published: {
    color: "#9E9E9E",
    fontFamily: "RobotoCondensed-Regular",
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
    shadowColor: "#000",
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
