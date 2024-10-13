import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { handleBookmark } from "src/code/helpers";
import { articleStyles } from "src/styles/article";
import { ArticleDetailProps } from "src/types/other";
import { SavedContext } from "../Nav";
import { shareArticle } from "./ShareArticle";

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
// TODO: rename to BottomArticleBar
function BottomBar(props: ArticleDetailProps) {
  const navigation = useNavigation();
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(props.uuid in savedArticles);
  // TODO: make the bottom bar buttons larger
  useEffect(() => {
    setSaved(props.uuid in savedArticles);
  }, [savedArticles, saved]);

  function handleShare() {
    const split = props.published_at.split("-");
    shareArticle(
      `https://www.browndailyherald.com/article/${split[0]}/${split[1]}/${props.slug}`
    );
  }

  // not doing individual article/section notifs for now
  // function handleNotification() {}
  // TODO: add a double tap to save article, double tap again to unsave
  return (
    <View
      style={articleStyles.actionBar}
      accessibilityLabel="Article Action Bar"
    >
      <View style={articleStyles.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{}}
          accessibilityLabel="Back Button"
          accessibilityHint="Press to go back to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handleNotification()}>
          <Image
            source={require("../../../assets/icons/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity> */}
      </View>

      <View style={articleStyles.actions}>
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => {
            Haptics.selectionAsync(); // Added haptic feedback
            handleBookmark(
              saved,
              props.slug,
              props.published_at,
              props.uuid,
              savedArticles,
              setSavedArticles,
              setSaved
            );
          }}
          accessible={true}
          accessibilityLabel="Bookmark Button"
          accessibilityHint="Press to bookmark or unbookmark the article"
        >
          {saved ? (
            <Ionicons name="bookmark" size={24} color="#1C1B1F" />
          ) : (
            <Ionicons name="bookmark-outline" size={24} color="#1C1B1F" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare()}
          accessible={true}
          accessibilityLabel="Share Button"
          accessibilityHint="Press to share the article"
        >
          <Image
            source={require("../../../assets/icons/share.png")}
            style={articleStyles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BottomBar;
