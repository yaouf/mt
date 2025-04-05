import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { Tag } from "src/types/data";
import { CardProps } from "src/types/navStacks";
import {
  darkModeBackgroundColor,
  darkModeBgColorStd,
  darkModeTextColor,
  font1,
  font2,
  font3,
  varGray1,
  varRed,
  varTextColor,
} from "../../styles/styles";
import { formatDates } from "../../utils/formatDates";
import { useTheme } from "../ThemeContext";
  
  function SmallCardTop({ article, navigation }: CardProps) {
    const all_tags = article.tags.map((t: Tag) => t.name);
  
    let cardSize: StyleProp<ViewStyle> = { minWidth: "100%" };
    const { isDarkMode, toggleTheme } = useTheme();
    const containerStyle = isDarkMode ? darkStyles : styles;
  
    return (
      <View style={cardSize}>
        <TouchableWithoutFeedback
          style={styles2.touchableItem}
          onPress={() => navigation.push("Article", { data: article })}
          accessibilityRole="button"
          accessibilityHint={`Double tap to open article`}
        >
          <View style={containerStyle.card}>
            <View style={containerStyle.text}>
            <View style={{display: "flex", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "flex-end", marginBottom: 8}}>
            <Text style={{color: varRed, fontWeight: 700, fontFamily: font2, fontSize: 12,}}
              accessibilityLabel={`Section: ${all_tags[0].replace("&;", "&")}.`}
            >
              {all_tags[0].replace("&;", "&")}
            </Text>
            </View>
              <Text style={containerStyle.title}
                accessibilityLabel={`Headline: ${article.headline}.`}
              >
                {article.headline}
              </Text>
              <Text style={containerStyle.subhead} numberOfLines={6} ellipsizeMode="tail"
                accessibilityLabel={`Subtitle: ${article.subhead}.`}
              >
              {article.subhead}
            </Text>
              <Text style={containerStyle.published}
                accessibilityLabel={`Published on ${formatDates(article.published_at)}.`}
              >
                {formatDates(article.published_at)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  
  export default SmallCardTop;
  
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
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: 20,
      overflow: "hidden",
      flexWrap: "nowrap",
      marginBottom: 8,
    },
    card: {
      display: "flex",
      // width: 170,
      // width: "48%",
      flexDirection: "column",
      alignItems: "stretch",
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
      paddingBottom: 8,
      paddingHorizontal: 0,
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
      backgroundColor: darkModeBackgroundColor,
    },
    subhead: {
        alignSelf: "stretch",
        color: varTextColor,
        fontFamily: font1,
        fontSize: 16,
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

  const darkStyles = StyleSheet.create({
    title: {
      height: "auto",
      alignSelf: "stretch",
      color: darkModeTextColor,
      fontFamily: font1,
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: 20,
      overflow: "hidden",
      flexWrap: "nowrap",
      marginBottom: 8,
    },
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      borderRadius: 0,
      backgroundColor: darkModeBgColorStd,
      overflow: "visible",
    },
    section: {
      color: varGray1,
      fontFamily: font3,
      fontSize: 10,
      fontStyle: "normal",
    },
    published: {
      color: varGray1,
      fontFamily: font3,
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
    },
    text: {
      display: "flex",
      flexDirection: "column",
      paddingBottom: 8,
      paddingHorizontal: 0,
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
    subhead: {
        alignSelf: "stretch",
        color: darkModeTextColor,
        fontFamily: font1,
        fontSize: 16,
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
  