import { createStackNavigator } from "@react-navigation/stack";
import { SettingsStackProps } from "src/types/navStacks";
import ArticleScreen from "../article/ArticleScreen";
import AuthorSubscriptions from "./AuthorSubscriptions";
import DevTeam from "./DevTeam";
import SavedArticles from "./SavedArticles";
import SettingsScreen from "./SettingsScreen";

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
        name="Article" // to open articles that were saved
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="SavedArticles" // all saved articles page
        component={SavedArticles}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="AuthorSubscriptions"
        component={AuthorSubscriptions}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="DevTeam" // to see team credits
        component={DevTeam}
        options={{ headerShown: false }}
      />
      {/* <SettingsStack.Screen
        name="Staff" 
        component={Staff}
        options={{ headerShown: false }}
      /> */}
    </SettingsStack.Navigator>
  );
}

export default SettingsStackScreen;
