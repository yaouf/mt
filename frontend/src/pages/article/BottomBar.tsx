import { articleStyles } from "src/styles/article";
import { View, Image, TouchableOpacity } from "react-native";
import { shareArticle } from "./ShareArticle";
import { updateAsync } from "src/code/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { SavedContext } from "../Nav";

type BottomBarProps = {
  published_at: string;
  slug: string;
  uuid: string;
};

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
function BottomBar(props: BottomBarProps) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState(props.uuid in savedArticles);

  useEffect(() => {
    if (props.uuid in savedArticles) {
      setSaved(true);
    }
  }, [savedArticles, saved]);

  function handleShare() {
    shareArticle(`https://browndailyherald.com/${props.uuid}`);
  }

  function handleBookmark() {
    updateAsync(
      "savedArticles",
      savedArticles,
      props.uuid,
      !saved,
      setSavedArticles,
      props.slug,
      props.published_at
    ).then(() => setSaved((prev) => !prev));
  }

  // not doing individual article/section notifs for now
  // function handleNotification() {}

  return (
    <View style={articleStyles.actionBar}>
      <View style={articleStyles.actions}>
        {/* <TouchableOpacity onPress={() => handleNotification()}>
          <Image
            source={require("../../../assets/icons/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => handleBookmark()}>
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
