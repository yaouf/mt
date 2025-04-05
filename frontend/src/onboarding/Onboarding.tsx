import { createStackNavigator } from '@react-navigation/stack';
import { useNotification } from 'src/pages/settings/NotificationProvider';
import { NavProp, OnboardParams } from '../types/navStacks';
import PushNotifsOnboardingScreen from './PushNotifsOnboardingScreen';
import UpdateScreen from './UpdateScreen';
import WelcomeScreen from './WelcomeScreen';

const onboardingStack = createStackNavigator<OnboardParams>();

// add auth in future versions of app
function Onboarding({ navigation }: NavProp) {
  const { isUpdate } = useNotification();

  console.log('update', isUpdate);

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
        initialParams={{ parentNav: navigation }}
        options={{ headerShown: false }}
      />
    </onboardingStack.Navigator>
  );
}

export default Onboarding;
