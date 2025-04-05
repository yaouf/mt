import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import BottomActionBar from "src/components/common/BottomActionBar";
import { ArticleDetailProps } from "src/types/other";
import { handleBookmark } from "src/utils/helpers";
import { SavedContext } from "../MainTabNavigator";
import { shareArticle } from "./ShareArticle";
import { useTheme } from "src/components/ThemeContext";
import { darkTextSecondaryColor } from "src/styles/styles";

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
function BottomArticleBar(props: ArticleDetailProps) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(props.uuid in savedArticles);
  const { isDarkMode, toggleTheme } = useTheme();
  const iconColor = isDarkMode ? darkTextSecondaryColor : "#1C1B1F";

  useEffect(() => {
    setSaved(props.uuid in savedArticles);
  }, [savedArticles, saved]);

  function handleShare() {
    const split = props.published_at.split("-");
    shareArticle(
      `https://www.browndailyherald.com/article/${split[0]}/${split[1]}/${props.slug}`
    );
  }

  const bookmarkButton = (
    <TouchableOpacity
      style={{ paddingRight: 10 }}
      onPress={() => {
        Haptics.selectionAsync();
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
        <Ionicons name="bookmark" size={26} color={iconColor} />
      ) : (
        <Ionicons name="bookmark-outline" size={26} color={iconColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <BottomActionBar onShare={handleShare} rightButtons={bookmarkButton} />
  );
}

export default BottomArticleBar;
