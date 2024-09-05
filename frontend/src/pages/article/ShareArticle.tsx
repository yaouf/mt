import { Alert, Share } from "react-native";
import { trackEvent } from "@aptabase/react-native";

export const shareArticle = async (uri: string) => {
  try {
    const result = await Share.share({
      message: uri,
    });
  } catch (error: any) {
    Alert.alert(error.message);
  } finally {
    trackEvent("sharedarticle", {uri});
  }
};
