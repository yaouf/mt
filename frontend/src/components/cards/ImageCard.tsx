import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { CardProps } from "src/types/navStacks";
import { font1, varTextColor } from "../../styles/styles";

function ImageCard({ article, navigation }: CardProps) {
  let img_uri =
    "https://d35jcxe8no8yhr.cloudfront.net/1054f24d72785fb7b6a4e1283656e2ab/dist/img/placeholder-4x3.png";
  if (article.dominantMedia.attachment_uuid) {
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
          <Image
            source={{
              uri: img_uri,
            }}
            style={styles.image}
          />
          <View style={styles.text}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {article.headline}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default ImageCard;

const styles = StyleSheet.create({
  title: {
    width: 96,
    height: 38,
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
  },
  card: {
    display: "flex",
    width: 96,
    flexDirection: "column",
    alignItems: "stretch",
    shadowColor: varTextColor,
    shadowOffset: {
      width: 0,
      height: 1.497,
    },
    shadowOpacity: 0.08,
    shadowRadius: 29.949,
    elevation: 3,
  },
  image: {
    backgroundColor: "#C9C9C9",
    display: "flex",
    height: 100,
    width: 96,
    paddingTop: 39.997,
    paddingBottom: 38.769,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 16,
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 4,
    height: 38,
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
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
