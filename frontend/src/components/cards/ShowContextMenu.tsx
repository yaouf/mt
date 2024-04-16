import { ActionSheetIOS, Alert, Clipboard, Share } from "react-native";
import { ArticleProps, ShareProps } from "src/types/types";
import { shareArticle } from "./ShareArticle";


export const showContextMenu = (uri: string) => {
  // deprecated, but works
  const onCopy = async (uri: string) => {
    Clipboard.setString(uri);
  };
  // doesn't work on android, only ios
  // temporary solution?
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Save", "Share", "Copy Link", "Report Issue", "Cancel"],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        console.log("Save selected");
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
