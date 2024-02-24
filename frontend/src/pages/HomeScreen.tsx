import { WebView } from "react-native-webview";
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

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://www.browndailyherald.com/" }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          // The WebView is not at the top of its history stack
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
        }}
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
