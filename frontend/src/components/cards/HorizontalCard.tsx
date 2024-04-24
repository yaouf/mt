import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { showContextMenu } from "./ShowContextMenu";
import { Article, Author, CardProps } from "src/types/types";
import { formatDates } from "../../code/formatDates";
import { font1, font2, font3 } from "../../styles/styles";

function HorizontalCard({ article, navigation }: CardProps) {
  const uri = "https://www.browndailyherald.com/" + article.uuid;
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.push("Article", { data: article })}
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Image
            source={{
              uri:
                "http://snworksceo.imgix.net/" +
                article.dominantMedia.attachment_uuid,
            }}
            style={styles.image}
          />
          <View style={styles.text}>
            <View style={styles.innerText}>
              <Text style={styles.section}>{article.tags[0].name}</Text>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {article.headline}
              </Text>
              <Text style={styles.author}>
                {article.authors.map((a: Author) => a.name).join(", ")}
              </Text>
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
    </TouchableWithoutFeedback>
  );
}

export default HorizontalCard;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    width: 358,
    height: 120,
    flexDirection: "column",
    alignItems: "flex-end",
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.497,
    },
    shadowOpacity: 0.08,
    shadowRadius: 29.949,
  },
  content: {
    display: "flex",
    paddingRight: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 8,
    alignSelf: "stretch",
  },
  image: {
    display: "flex",
    paddingTop: 35.893,
    paddingRight: 21.133,
    paddingBottom: 34.62,
    paddingLeft: 24.38,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
    backgroundColor: "#C9C9C9",
    width: 95,
    height: 120,
  },
  text: {
    display: "flex",
    width: 247,
    paddingVertical: 16,
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 16,
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
  section: {
    color: "#9E9E9E",
    fontFamily: font3,
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    // lineHeight: 1,
  },
  title: {
    height: 38,
    alignSelf: "stretch",
    overflow: "hidden",
    flexWrap: "nowrap",
    fontFamily: font1,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 18,
  },
  author: {
    color: "#000",
    fontFamily: font2,
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 14,
  },
  published: {
    color: "#9E9E9E",
    fontFamily: font3,
    fontSize: 10,
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
