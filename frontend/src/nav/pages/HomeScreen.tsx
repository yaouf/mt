import { WebView, WebViewNavigation } from "react-native-webview";
import { useRef, useState } from "react";
import {
  View,
  Button,
  Dimensions,
} from "react-native";
import { HomeProps } from "../../types/types";
import { baseStyles } from "../../styles/styles";
import SmallCard from "src/components/cards/SmallCard";
import LargeCard from "src/components/cards/LargeCard";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { dummyData } from "../../dummyData";
import Search from "src/components/Search";

/**
 * Home screen with embedded web view
 *
 * @param param navigation param from BDH parent component
 * @returns Home Screen
 */
function HomeScreen({ navigation }: HomeProps) {
  const webviewRef = useRef<WebView>(null);

  // initializes percentage of content offset
  const [offsetPercent, setOffsetPercent] = useState(0);

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

  const screenHeight = Dimensions.get("window").height;

  // sets position of search text input box
  const [scrollPositionText, setScrollPositionText] = useState(
    (165 / 812) * screenHeight
  );

  // sets position of search button
  const [scrollPositionButton, setScrollPositionButton] = useState(
    (159 / 812) * screenHeight
  );

  // determines position of scroll
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;

    if (contentOffset.y > 120) {
      // if scrolled down more than height of search bar, fix the search bar at top of screen
      setScrollPositionButton((40 / 812) * screenHeight);
      setScrollPositionText((45 / 812) * screenHeight);
    } else {
      // makes content offset into a ratio
      setOffsetPercent(contentOffset.y / 812);

      // keep search bar unfixed on WebView
      setScrollPositionButton((159 / 812 - offsetPercent) * screenHeight);
      setScrollPositionText((165 / 812 - offsetPercent) * screenHeight);
    }
  };

  // const handleLinkPress = () => {
  //   navigation.push('Article', { articleUrl: url })
  // }

  return (
    <View>
      <SmallCard article={dummyData[0]} />

      <Search
        scrollPositionText={scrollPositionText}
        screenHeight={screenHeight}
        scrollPositionButton={scrollPositionButton}
      />

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
        onScroll={handleScroll}
      />
    </View>
  );
}

export default HomeScreen;
