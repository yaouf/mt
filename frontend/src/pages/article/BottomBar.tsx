import { articleStyles } from "src/styles/article";
import { View, Image, TouchableOpacity } from "react-native";
import { shareArticle } from "./ShareArticle";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { SavedContext } from "../Nav";
import { handleBookmark } from "src/code/helpers";
import { ArticleDetailProps } from "src/types/other";
import { useNavigation } from "@react-navigation/native";

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
function BottomBar(props: ArticleDetailProps) {
  const navigation = useNavigation();
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(props.uuid in savedArticles);

  useEffect(() => {
    setSaved(props.uuid in savedArticles);
  }, [savedArticles, saved]);

  function handleShare() {
    shareArticle(`https://browndailyherald.com/${props.uuid}`);
  }

  // not doing individual article/section notifs for now
  // function handleNotification() {}

  return (
    <View style={articleStyles.actionBar}>
      <View style={articleStyles.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingRight: 290 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handleNotification()}>
          <Image
            source={require("../../../assets/icons/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            handleBookmark(
              saved,
              props.slug,
              props.published_at,
              props.uuid,
              savedArticles,
              setSavedArticles,
              setSaved
            )
          }
        >
          {saved ? (
            <Ionicons name="bookmark" size={24} color="#1C1B1F" />
          ) : (
            <Ionicons name="bookmark-outline" size={24} color="#1C1B1F" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare()}>
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
