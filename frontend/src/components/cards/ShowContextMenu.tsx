import { Clipboard, View } from "react-native";
import { shareArticle } from "../../pages/article/ShareArticle";
import { useContext, useEffect, useState } from "react";
import { handleBookmark } from "src/code/helpers";
import { SavedContext } from "src/pages/Nav";
import { ArticleDetailProps } from "src/types/types";
import { HoldItem } from "react-native-hold-menu";
import { Feather, Ionicons } from "@expo/vector-icons";
import { varTextColor } from "src/styles/styles";

// https://enesozturk.github.io/react-native-hold-menu/docs
function ShowContextMenu(props: ArticleDetailProps) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState(props.uuid in savedArticles);

  let size = 16;
  if (props.large) {
    size = 24;
  }

  useEffect(() => {
    if (props.uuid in savedArticles) {
      setSaved(true);
    }
  }, [savedArticles]);

  const uri = "https://www.browndailyherald.com/" + props.uuid;
  const saveOption = !saved ? "Save Story" : "Unsave Story";

  return (
    <View
      style={{
        position: "absolute",
        bottom: 8,
        right: 12,
        zIndex: 9999,
        // padding: 8,
      }}
    >
      <HoldItem
        activateOn="tap"
        items={[
          {
            text: saveOption,
            icon: () => (
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={varTextColor}
              />
            ),
            onPress: () => {
              handleBookmark(
                saved,
                props.slug,
                props.published_at,
                props.uuid,
                savedArticles,
                setSavedArticles,
                setSaved
              );
            },
          },
          {
            text: "Share",
            icon: () => (
              <Ionicons name="share-outline" size={24} color={varTextColor} />
            ),
            onPress: () => {
              shareArticle(uri);
            },
          },
          {
            text: "Copy Link",
            icon: () => <Ionicons name="link" size={24} color={varTextColor} />,
            withSeparator: true,
            onPress: () => {
              Clipboard.setString(uri);
            },
          },
          {
            text: "Report Issue",
            icon: () => <Feather name="alert-octagon" size={24} color="red" />,
            isDestructive: true,
            onPress: () => {
              console.log("Report Issue selected"); // TODO: add link to report issue
            },
          },
        ]}
      >
        <Feather name="more-horizontal" size={size} color={varTextColor} />
      </HoldItem>
    </View>
  );
}

export default ShowContextMenu;
