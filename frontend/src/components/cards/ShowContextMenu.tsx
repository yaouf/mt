import { ActionSheetIOS, Alert, Clipboard, Share } from "react-native";
import { shareArticle } from "../../pages/article/ShareArticle";
import { Dispatch, SetStateAction, useState } from "react";
import { removeAsync, setAsync, updateAsync } from "src/code/helpers";

// TODO: issues connexting this to update the saved or not

export const showContextMenu = (
  uuid: string,
  saved: boolean, // whether or not article is already saved
  savedArticles: Object,
  setSavedArticles: Dispatch<SetStateAction<Object>>,
  slug: string,
  published_at: string
) => {
  const uri = "https://www.browndailyherald.com/" + uuid;

  console.log(saved);

  const saveOption = !saved ? "Save" : "Unsave";

  // deprecated, but works
  const onCopy = async (uri: string) => {
    Clipboard.setString(uri);
  };
  // doesn't work on android, only ios
  // temporary solution?
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: [saveOption, "Share", "Copy Link", "Report Issue", "Cancel"],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        updateAsync(
          "savedArticles",
          savedArticles,
          uuid,
          !saved,
          setSavedArticles,
          slug,
          published_at
        );
      } else if (buttonIndex === 1) {
        shareArticle(uri);
      } else if (buttonIndex === 2) {
        onCopy(uri);
      } else if (buttonIndex === 3) {
        console.log("Report Issue selected");
      }
    }
  );
};
