import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { articleStyles } from "src/styles/article";

/**
 * Bottom bar for saved articles page
 * go back
 */
function BottomSavedArticlesBar() {
  const navigation = useNavigation();

  return (
    <View
      style={articleStyles.actionBar}
      accessibilityLabel="Article Action Bar"
    >
      <View style={articleStyles.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{}}
          accessibilityLabel="Back Button"
          accessibilityHint="Press to go back to the previous screen"
        >
          <Ionicons name="arrow-back" size={26} color="#1C1B1F" />
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
