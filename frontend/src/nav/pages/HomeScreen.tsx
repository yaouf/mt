import { WebView, WebViewNavigation } from "react-native-webview";
import { useRef } from "react";
import { View, Button } from "react-native";
import { HomeProps } from "../../types";
import { baseStyles } from "../../styles/styles";

/**
 * Home screen with embedded web view
 *
 * @param param navigation param from BDH parent component
 * @returns Home Screen
 */
function HomeScreen({ navigation }: HomeProps) {
  const webviewRef = useRef<WebView>(null);

  // handle navigation state change
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

  // determine whether to load the request or not
  const shouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url || "";

    // Check if the URL contains the specific string
    if (url.includes("/article/")) {
      // Redirect to Article component
      navigation.push("Article", { articleUrl: url });
      // Do not load the URL
      return false;
    }
    // Continue loading for other URLs
    return true;
  };

  return (
    <View style={baseStyles.container}>
      <WebView
        // originWhitelist={[
        //   "https://www.browndailyherald.com*",
        //   "https://projects.browndailyherald.com*",
        // ]}
        originWhitelist={["*"]}
        ref={webviewRef}
        source={{ uri: "https://www.browndailyherald.com/" }}
        style={baseStyles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
      />
    </View>
  );
}

export default HomeScreen;
