import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { showContextMenu } from "./ShowContextMenu";
import { Author, CardProps } from "src/types/types";
import { formatDates } from "../../code/formatDates";
import { font1, font2, font3 } from "../../styles/styles";
import { useContext, useEffect, useState } from "react";
import { SavedContext } from "src/pages/Nav";

function HorizontalCard({ article, navigation }: CardProps) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedArticles.includes(article.uuid)) {
      setSaved(true);
    }
  }, [savedArticles]);

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
    <TouchableWithoutFeedback
      onPress={() => navigation.push("Article", { data: article })}
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Image
            source={{
              uri: img_uri,
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
              onPress={() =>
                showContextMenu(
                  article.uuid,
                  saved,
                  savedArticles,
                  setSavedArticles
                )
              }
              onLongPress={() =>
                showContextMenu(
                  article.uuid,
                  saved,
                  savedArticles,
                  setSavedArticles
                )
              }
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
    // width: 358,
    width: "100%",
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
