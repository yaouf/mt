import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "src/components/ThemeContext";
import { articleStyles, darkArticleStyles } from "src/styles/article";

/**
 * Bottom bar for saved articles page
 * go back
 */
function BottomSavedArticlesBar() {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();
  const articleStyle = isDarkMode ? darkArticleStyles : articleStyles;
  const logoColor = isDarkMode ? "#FFFFFF" : "#1C1B1F";

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
          <Ionicons name="arrow-back" size={26} color={logoColor} />
        </TouchableOpacity>
      </View>

      {/* <View style={articleStyles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={{ paddingRight: 10 }}
          accessibilityLabel="Home Button"
          accessibilityHint="Press to return to the home screen"
        >
          <Ionicons name="home-outline" size={26} color="#1C1B1F" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

export default BottomSavedArticlesBar;
