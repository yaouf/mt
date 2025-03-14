import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import { articleStyles, darkArticleStyles } from "src/styles/article";
import { useTheme } from "../ThemeContext";
import { darkTextSecondaryColor } from "src/styles/styles";

interface BottomActionBarProps {
  onShare: () => void;
  rightButtons?: React.ReactNode;
}

/**
 * shared base bottom action bar for article and staff pages
 * go back, share, (notifications for this section / author in a future version)
 * @param onShare - function to handle share
 * @param rightButtons - optional React node to add additional buttons to the right of the action bar
 * @returns
 */
function BottomActionBar({ onShare, rightButtons }: BottomActionBarProps) {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();
  const articleStyle = isDarkMode ? darkArticleStyles : articleStyles;
  const iconColor = isDarkMode ? darkTextSecondaryColor : "#1C1B1F";
  return (
    <View
      style={articleStyle.actionBar}
      accessibilityLabel="Article Action Bar"
    >
      <View style={articleStyle.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{}}
          accessibilityLabel="Back Button"
          accessibilityHint="Press to go back to the previous screen"
        >
          <Ionicons name="arrow-back" size={26} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={articleStyle.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={{ paddingRight: 10 }}
          accessibilityLabel="Home Button"
          accessibilityHint="Press to return to the home screen"
        >
          <Ionicons name="home-outline" size={26} color={iconColor} />
        </TouchableOpacity>
        {/* Adds new actions to middle of right side */}
        {rightButtons}
        <TouchableOpacity
          onPress={onShare}
          accessible={true}
          accessibilityLabel="Share Button"
          accessibilityHint="Press to share the article"
        >
          <Image
            source={require("../../../assets/icons/share.png")}
            style={articleStyle.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BottomActionBar;
