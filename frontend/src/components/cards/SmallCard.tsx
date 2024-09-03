import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from "react-native";
import { CardProps } from "src/types/navStacks";
import { shortFormatDates } from "../../code/formatDates";
import {
  font1,
  font2,
  font3,
  varTextColor,
  varGray1,
  varRed,
  varTextSecondaryColor,
} from "../../styles/styles";
import ShowContextMenu from "./ShowContextMenu";

function SmallCard({ article, navigation, specialWidth }: CardProps) {
  const all_tags = article.tags.map((t: Tag) => t.name);
  // let cardStyles: StyleProp<ViewStyle> = {
  //   ...styles.card,
  //   ...{ width: "48%" },
  // };
  // if (specialWidth !== undefined) {
  //   // @ts-ignore
  //   cardStyles = { ...styles.card, ...{ width: specialWidth } };
  // }

  let cardSize: StyleProp<ViewStyle> = { minWidth: "100%" };
  if (specialWidth !== undefined) {
    cardSize = { width: specialWidth };
  }


  return (
    <View style={cardSize}>
      <TouchableWithoutFeedback
        style={styles2.touchableItem}
        onPress={() => navigation.push("Article", { data: article })}
      >
        <View style={styles.card}>
          <View style={styles.text}>
            <Text style={styles.title}>
              {article.headline}
            </Text>
            {article.subhead && article.subhead.trim() !== '' && (
            <Text style={styles.subhead}>
              {article.subhead}
<<<<<<< Updated upstream
            </Text>
          )}

            <View style={{display: "flex", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "flex-end"}}>
          <Text style={styles.author}>
              {article.authors.map((a: Author) => a.name).join(", ")}
            </Text>
=======
            </Text>
          )}
            <View style={{display: "flex", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "flex-end"}}>
>>>>>>> Stashed changes
          <Text style={styles.published}>
                  {shortFormatDates(article.published_at)}
          </Text>
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
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  title: {
    height: "auto",
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    overflow: "hidden",
    flexWrap: "nowrap",
    marginBottom: 4,
<<<<<<< Updated upstream
  },
  author: {
    color: varTextSecondaryColor,
    fontFamily: font2,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 14,
    maxWidth: "75%",

=======
>>>>>>> Stashed changes
  },
  card: {
    display: "flex",
    // width: 170,
    // width: "48%",
    flexDirection: "column",
    alignItems: "flex-start",
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
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    // fontWeight: "500",
    /* line-height: normal; */
  },
  text: {
    display: "flex",
    flexDirection: "column",
<<<<<<< Updated upstream
    paddingHorizontal: 12,
=======
    paddingHorizontal: 0,
>>>>>>> Stashed changes
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
  subhead: {
    alignSelf: "stretch",
    color: varTextColor,
    fontFamily: font1,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12, 
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
