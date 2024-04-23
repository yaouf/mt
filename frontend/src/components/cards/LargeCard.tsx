import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { showContextMenu } from "./ShowContextMenu";

interface CardProps {
  title: string;
  author: string;
  section: string;
  published: string;
  imageuri: string;
  uri: string;
  breaking: boolean;
}

function LargeCard({
  title,
  author,
  section,
  published,
  imageuri,
  uri,
  breaking,
}: CardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageuri }} style={styles.image} />
      <View style={styles.text}>
        {breaking ? (
          <View style={styles.breakingBox}>
            <Text style={styles.breaking}>Breaking News</Text>
          </View>
        ) : (
          <Text style={styles.section}>{section}</Text>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <View style={styles.bottom}>
          <View style={styles.publishedSection}>
            <Text style={styles.published}>{published}</Text>
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
