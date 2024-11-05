import { createStackNavigator } from "@react-navigation/stack";
import { NavProp, OnboardParams } from "../types/navStacks";
import PushNotifsOnboardingScreen from "./PushNotifsOnboardingScreen";
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
        component={PushNotifsOnboardingScreen}
        initialParams={{ parentNav: navigation }}
        options={{ headerShown: false }}
      />
    </onboardingStack.Navigator>
  );
}

export default Onboarding;
