import { WebView , WebViewNavigation } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useRef } from "react";
import { View, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type HomeProps = {
  navigation: StackNavigationProp<any, any>;
};

/**
 * Home screen with embedded web view
 *
 * @param param navigation param from BDH parent component
 * @returns Home Screen
 */

function Home({ navigation }: HomeProps) {
  const webviewRef = useRef<WebView>(null);
 
  // Define the function to handle navigation state change
  const handleNavigationStateChange = (navState: any) => {
    if (navState.canGoBack) {
      navigation.setOptions({
        headerLeft: () => (
          <Button
            onPress={() => webviewRef.current?.goBack()}
            title="Back"
            color="#000"
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  };
 
  // Define the function to determine whether to load the request or not
  const shouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url || '';
 
    // Check if the URL contains the specific string
    if (url.includes('/article/')) {
      // Redirect to Article component
      navigation.navigate('Article', { articleUrl: url });
      // Do not load the URL
      return false;
    }
    // Continue loading for other URLs
    return true;
  };
 
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.browndailyherald.com/' }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
      />
    </View>
  );
 }
 
 export default Home;
 
 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
 }); 