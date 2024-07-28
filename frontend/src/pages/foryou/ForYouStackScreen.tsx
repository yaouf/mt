import { createStackNavigator } from "@react-navigation/stack";
import ArticleComponent from "../article/ArticleScreen";
import { FYStackProps } from "src/types/navStacks";
import ForYouScreen from "./ForYouScreen";

const ForYouStack = createStackNavigator<FYStackProps>();

function ForYouStackScreen() {
  return (
    <ForYouStack.Navigator>
      <ForYouStack.Screen
        name="ForYouScreen"
        component={ForYouScreen}
        options={{ headerShown: false }}
      />
      <ForYouStack.Screen
        name="Article"
        component={ArticleComponent}
        options={{ headerShown: false }}
      />
    </ForYouStack.Navigator>
  );
}

export default ForYouStackScreen;
