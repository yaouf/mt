import { createStackNavigator } from "@react-navigation/stack";
import { SettingsStackProps } from "src/types/types";
import ArticleScreen from "../article/ArticleScreen";
import SettingsScreen from "./SettingsScreen";
import Staff from "../staff/Staff";

const SettingsStack = createStackNavigator<SettingsStackProps>();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="Article" // to open saved articles
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      {/* <SettingsStack.Screen
        name="SavedArticles" // for all saved articles
        component={ArticleScreen}
        options={{ headerShown: false }}
      /> */}
      {/* <SettingsStack.Screen
        name="Staff" 
        component={Staff}
        options={{ headerShown: false }}
      /> */}
    </SettingsStack.Navigator>
  );
}

export default SettingsStackScreen;
