import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { articleStyles } from "src/styles/article";
import { ArticleDetailProps } from "src/types/other";
import { handleBookmark } from "src/utils/helpers";
import { SavedContext } from "../BottomNavigator";
import { shareArticle } from "./ShareArticle";

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
<<<<<<< HEAD
// TODO: rename to BottomArticleBar
=======
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
function BottomArticleBar(props: ArticleDetailProps) {
  const navigation = useNavigation();
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(props.uuid in savedArticles);
  // TODO: if deviceId does not exist, go through onboarding again.
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
<<<<<<< HEAD
          <Ionicons name="arrow-back" size={28} color="#1C1B1F" />
=======
          <Ionicons name="arrow-back" size={26} color="#1C1B1F" />
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
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
<<<<<<< HEAD
            <Ionicons name="bookmark" size={28} color="#1C1B1F" />
          ) : (
            <Ionicons name="bookmark-outline" size={28} color="#1C1B1F" />
=======
            <Ionicons name="bookmark" size={26} color="#1C1B1F" />
          ) : (
            <Ionicons name="bookmark-outline" size={26} color="#1C1B1F" />
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
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

export default BottomArticleBar;
