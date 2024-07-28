import { NavProp, OnboardParams } from "../types/navStacks";
import { createStackNavigator } from "@react-navigation/stack";
import PushNotifsScreen from "./PushNotifsScreen";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./WelcomeScreen";

const onboardingStack = createStackNavigator<OnboardParams>();

// add auth in future versions of app
function Onboarding({ navigation }: NavProp) {
  return (
    <onboardingStack.Navigator initialRouteName="WelcomeScreen">
      <onboardingStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <onboardingStack.Screen
        name="PushNotifs"
        component={PushNotifsScreen}
        initialParams={{ parentNav: navigation }}
        options={{ headerShown: false }}
      />
    </onboardingStack.Navigator>
  );
}

export default Onboarding;
