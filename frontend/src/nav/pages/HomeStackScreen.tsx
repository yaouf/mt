import ArticleScreen from "../../components/Article";
import HomeScreen from "./HomeScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { ComponentParams } from "../../types";

const HomeStack = createStackNavigator<ComponentParams>();

const horizontalTransition = ({ current, layouts }: any) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  return { cardStyle: { transform: [{ translateX }] } };
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ cardStyleInterpolator: horizontalTransition }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
