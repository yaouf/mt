import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import ShowContextMenu from "./ShowContextMenu";
import { CardProps } from "src/types/navStacks";
import { Author, Tag } from "src/types/data";
import { formatDates } from "../../code/formatDates";
import {
  font1,
  font2,
  font3,
  varTextColor,
  varGray1,
} from "../../styles/styles";

function LargeCard({ article, navigation }: CardProps) {
  const all_tags = article.tags.map((t: Tag) => t.name);
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
      "http://snworksceo.imgix.net/bdh/" +
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
          <Image
            source={{
              uri: img_uri,
            }}
            style={styles.image}
          />
          <View style={styles.text}>
            {breaking ? (
              <View style={styles.breakingBox}>
                <Text style={styles.breaking}>Breaking News</Text>
              </View>
            ) : (
              <Text style={styles.section}>
                {all_tags[0].replace("&;", "&")}
              </Text>
            )}
            <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">
              {article.headline}
            </Text>
            <Text style={styles.author}>
              {article.authors.map((a: Author) => a.name).join(", ")}
            </Text>
            <View style={styles.bottom}>
              <View style={styles.publishedSection}>
                <Text style={styles.published}>
                  {formatDates(article.published_at)}
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
        large={true}
      />
    </View>
  );
}

export default LargeCard;

const styles = StyleSheet.create({
  title: {
    height: 93,
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 28,
  },
  author: {
    color: varTextColor,
    fontFamily: font2,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 20,
  },
  card: {
    display: "flex",
    width: "100%",
    paddingBottom: 8,
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
    marginTop: 16,
    overflow: "visible",
    // marginVertical: 12,
  },
  section: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 16,
    fontStyle: "normal",
    // fontWeight: "500",
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
