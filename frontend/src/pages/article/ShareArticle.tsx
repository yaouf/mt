import { Alert, Share } from "react-native";

export const shareArticle = async (uri: string) => {
  try {
    const result = await Share.share({
      message: "Check out this article! " + uri,
    });
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
