import { useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavProp, OnboardParams } from "../types/navStacks";
import PushNotifsOnboardingScreen from "./PushNotifsOnboardingScreen";
import UpdateScreen from "./UpdateScreen";
import WelcomeScreen from "./WelcomeScreen";

const onboardingStack = createStackNavigator<OnboardParams>();

// add auth in future versions of app
function Onboarding({ navigation }: NavProp) {
  const { isUpdate } = useRoute().params as { isUpdate: boolean };

  console.log("update", isUpdate);
  
  return (
    <onboardingStack.Navigator initialRouteName="WelcomeScreen">
      {isUpdate ? (
        <onboardingStack.Screen
          name="UpdateScreen"
          component={UpdateScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <onboardingStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
      )}
      <onboardingStack.Screen
        name="PushNotifs"
        component={PushNotifsOnboardingScreen}
        initialParams={{ parentNav: navigation, isUpdate }}
        options={{ headerShown: false }}
      />
    </onboardingStack.Navigator>
  );
}

export default Onboarding;
