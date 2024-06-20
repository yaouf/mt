import { OnboardParams, OnboardProps } from "../types/types";
import { createStackNavigator } from "@react-navigation/stack";
import PushNotifsScreen from "./PushNotifsScreen";
import DoneScreen from "./DoneScreen";
import { NavigationContainer } from "@react-navigation/native";
import Screen1 from "./Screen1";

const onboardingStack = createStackNavigator<OnboardParams>();

// no login for first version
function Onboarding(props: OnboardProps) {
  return (
    <NavigationContainer>
      <onboardingStack.Navigator initialRouteName="Screen1">
        <onboardingStack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerShown: false }}
        />
        <onboardingStack.Screen
          name="PushNotifs"
          component={PushNotifsScreen}
          options={{ headerShown: false }}
        />
        <onboardingStack.Screen
          name="Done"
          component={DoneScreen}
          initialParams={{ ...props }}
          options={{ headerShown: false }}
        />
      </onboardingStack.Navigator>
    </NavigationContainer>
  );
}

export default Onboarding;
