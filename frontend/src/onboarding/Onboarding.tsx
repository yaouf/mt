import { NavProp, OnboardParams, OnboardProps } from "../types/types";
import { createStackNavigator } from "@react-navigation/stack";
import PushNotifsScreen from "./PushNotifsScreen";
import { NavigationContainer } from "@react-navigation/native";
import Screen1 from "./Screen1";

const onboardingStack = createStackNavigator<OnboardParams>();

// no login for first version
function Onboarding({ navigation }: NavProp) {
  return (
    <onboardingStack.Navigator initialRouteName="Screen1">
      <onboardingStack.Screen
        name="Screen1"
        component={Screen1}
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
