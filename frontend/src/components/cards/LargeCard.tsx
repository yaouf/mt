
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { showContextMenu } from "./ShowContextMenu";
import { Article, Author, Tag } from "src/types/types";
import { formatDates } from "./FormatDates";


// function LargeCard({ route, navigation }: CardProps) {
function LargeCard({ article }: Article) {
  // const { article } = route.params;
  const uri = "https://www.browndailyherald.com/" + article.uuid;
  const all_tags = article.tags.map((t: Tag) => t.name);
  let breaking = false;

  for (let i = 0; i < all_tags.length; i++) {
    if (all_tags[i] == "breaking") {
      breaking = true;
    }
  }

  return (
  //   <TouchableWithoutFeedback
  //     onPress={() => navigation.navigate("Article", {articleUrl: uri})}
  //     onLongPress={() => navigation.navigate("Article", {articleUrl: uri})}
  // >
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
        {breaking ? (
          <View style={styles.breakingBox}>
            <Text style={styles.breaking}>Breaking News</Text>
          </View>
        ) : (
          <Text style={styles.section}>{all_tags[0]}</Text>
        )}
        <Text style={styles.title}>{article.headline}</Text>
        <Text style={styles.author}>
          {article.authors.map((a: Author) => a.name).join(", ")}
        </Text>
        <View style={styles.bottom}>
          <View style={styles.publishedSection}>
            <Text style={styles.published}>
              {formatDates(article.published_at)}
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
    // </TouchableWithoutFeedback>
  );
}

export default LargeCard;

const styles = StyleSheet.create({
  title: {
    height: 93,
    alignSelf: "stretch",
    color: "#000",
    fontFamily: "Georgia",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 28,
  },
  author: {
    color: "#000",
    fontFamily: "Roboto Flex",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 20,
  },
  card: {
    display: "flex",
    width: 358,
    paddingBottom: 8,
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
    marginVertical: 12,
  },
  section: {
    color: "#9E9E9E",
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 16,
    fontStyle: "normal",
    // fontWeight: "500",
    /* lineHeight: 'normal',*/
  },
  published: {
    color: "#9E9E9E",
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    /* line-height: normal; */
  },
  image: {
    backgroundColor: "#C9C9C9",
    display: "flex",
    height: 167.435,
    width: "100%",
    paddingTop: 59.893,
    paddingBottom: 58.055,
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
    paddingTop: 12,
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
    fontFamily: "Roboto Flex",
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