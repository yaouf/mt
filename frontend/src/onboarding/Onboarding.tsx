import LoginScreen from "./LoginScreen";
import { UserProps, OnboardParams, OnboardProps } from "../types/types";
import { createStackNavigator } from "@react-navigation/stack";
import PushNotifsScreen from "./PushNotifsScreen";
import DoneScreen from "./DoneScreen";
import { NavigationContainer } from "@react-navigation/native";

const onboardingStack = createStackNavigator<OnboardParams>();

function Onboarding(props: OnboardProps) {
  return (
    <NavigationContainer>
      <onboardingStack.Navigator initialRouteName="Login">
        <onboardingStack.Screen
          name="Login"
          component={LoginScreen}
          // initialParams={{ ...userProps }}
        />
        <onboardingStack.Screen
          name="PushNotifs"
          component={PushNotifsScreen}
          // initialParams={{ ...userProps }}
        />
        <onboardingStack.Screen
          name="Done"
          component={DoneScreen}
          initialParams={{ ...props }}
        />
      </onboardingStack.Navigator>
    </NavigationContainer>
  );
}

export default Onboarding;
