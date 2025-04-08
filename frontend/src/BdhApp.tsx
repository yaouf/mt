import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from './onboarding/Onboarding';
import MainTabNavigator from './pages/MainTabNavigator';
import { useNotification } from './pages/settings/NotificationProvider';
import { setAsync } from './utils/helpers';

const fullStack = createStackNavigator();

const linking = {
  prefixes: ['com.browndailyherald.thebrowndailyherald"://', 'https://browndailyherald.com'], // custom app scheme and web domain
  config: {
    screens: {
      HomeScreen: 'home',
      Article: 'article/:slug', // handles the article slug from deep link
    },
  },
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
  },
};

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize animated value
  const { isUpdate, setIsUpdate } = useNotification();
  useEffect(() => {
    const load = async () => {
      try {
        const deviceId = await AsyncStorage.getItem('deviceID');
        console.log('deviceId', deviceId);
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        if (onboarded === 'true' && deviceId) {
          console.log('onboarded is true');
          setHasOnboarded(true);
        } else {
          console.log('onboarded is false');
          setHasOnboarded(false);
        }
      } catch (err) {
        console.log('err while setting up notifications', err);
      }
    };
    // load();

    const checkAppVersion = async () => {
      const currentVersion = Constants.expoConfig?.version ?? '';
      const TARGET_VERSION = '1.1.0';
      const storedVersion = await AsyncStorage.getItem('appVersion');

      if (storedVersion !== currentVersion && currentVersion === TARGET_VERSION) {
        console.log('app version is out of date');
        // await AsyncStorage.clear();
        // log all async storage keys
        console.log('all async storage keys', await AsyncStorage.getAllKeys());
        setAsync('hasOnboarded', 'false');
        setHasOnboarded(false);
        // setAsync("appVersion", currentVersion);
        // should only set isUpdate if the deviceId is set, meaning the device is registered
        const deviceId = await AsyncStorage.getItem('deviceID');
        console.log('deviceId', deviceId);
        if (deviceId) {
          // only if the device id already exists too is it an update
          console.log('setting isUpdate to true');
          setIsUpdate(true);
        }
      } else {
        // if not an update, then treat as a new install
        console.log('setting isUpdate to false');
        setIsUpdate(false);
      }
    };
    // check app version first to see if we need to show the update screen, then load onboarding or main app
    checkAppVersion().then(() => {
      load();
    });

    // Trigger the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration of the fade-in animation
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    // <NotificationProvider>
    <NavigationContainer theme={MyTheme} linking={linking}>
      <SafeAreaProvider>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {hasOnboarded ? (
            <MainTabNavigator />
          ) : (
            <fullStack.Navigator
              initialRouteName={'Onboarding'}
              screenOptions={{ gestureEnabled: false }}
            >
              <fullStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
              />
              <fullStack.Screen
                name="MainApp"
                component={MainTabNavigator}
                options={{ headerShown: false }}
              />
            </fullStack.Navigator>
          )}
        </Animated.View>
      </SafeAreaProvider>
    </NavigationContainer>
    // </NotificationProvider>
  );
}

export default BdhApp;
