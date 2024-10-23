import { trackEvent } from "@aptabase/react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { formatDates } from "src/code/formatDates";
import { handleBookmark } from "src/code/helpers";
import { articleStyles } from "src/styles/article";
import { Article } from "src/types/data";
import { HomeStackProps } from "src/types/navStacks";
import { baseStyles } from "../../styles/styles";
import { SavedContext } from "../Nav";
import BottomBar from "./BottomBar";
import SplitArticle from "./SplitContent";

function ArticleScreen({
  route,
  navigation,
}: StackScreenProps<HomeStackProps, "Article">) {
  const article: Article = route.params.data;
  const [isBottomBarVisible, setBottomBarVisible] = useState(true);
  const scrollOffset = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current; // Animated value for translateY
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(article.uuid in savedArticles);

  useEffect(() => {
    trackEvent("article", {
      uuid: route.params.data.uuid,
      slug: route.params.data.slug,
    });
  }, []);

  useEffect(() => {
    // Animate the bottom bar in or out based on visibility state
    Animated.timing(translateY, {
      toValue: isBottomBarVisible ? 0 : 100, // 0 to show, 100 to hide (adjust based on bar height)
      duration: 180, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [isBottomBarVisible]);

  // Handle scroll direction to show/hide BottomBar
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    if (currentOffset <= 0) {
      setBottomBarVisible(true);
      return;
    }

    let direction = "up";

    if (currentOffset > scrollOffset.current) {
      direction = "down";
    } else if (currentOffset < scrollOffset.current) {
      direction = "up";
    }

    // Show BottomBar when scrolling up, hide when scrolling down
    if (direction) {
      setBottomBarVisible(direction === "up");
    }

    // Update the offset for the next event
    scrollOffset.current = currentOffset;
  };

  // Handle double-tap gesture
  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.END) {
      Haptics.selectionAsync();
      handleBookmark(
        saved,
        article.slug,
        article.published_at,
        article.uuid,
        savedArticles,
        setSavedArticles,
        setSaved
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} accessibilityLabel="Article Screen">
      <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
        <View style={{ flex: 1 }}>
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16} // Controls how often the event is fired, 16ms is around 60fps
          >
            <View style={baseStyles.container}>
              <View style={articleStyles.headingContainer}>
                <Text style={articleStyles.title}>{article.headline}</Text>
                {article.subhead ? (
                  <Text style={articleStyles.lead}>{article.subhead}</Text>
                ) : (
                  <View style={{ height: 0, marginBottom: 7.422 }} /> // Placeholder for gap
                )}
                <View
                  style={{
                    height: 1,
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: -15,
                  }}
                />
              </View>

              {article.dominantMedia.authors && (
                <View>
                  <Image
                    source={{
                      uri: `https://snworksceo.imgix.net/bdh/${article.dominantMedia.attachment_uuid}.sized-1000x1000.${article.dominantMedia.extension}`,
                    }}
                    style={articleStyles.image}
                    accessibilityLabel="Article Image"
                  />
                  <View style={baseStyles.container}>
                    {(article.dominantMedia.content ||
                      article.dominantMedia.authors) && (
                      <Text style={articleStyles.mediaCaption}>
                        {article.dominantMedia.content
                          ? article.dominantMedia.content
                              .replaceAll("\n", " ")
                              .replaceAll("<p>", "")
                              .replaceAll("</p>", "")
                              .replaceAll("&nbsp;", " ")
                              .replaceAll("<br>", "")
                      : ""}
                        {article.dominantMedia.authors.length > 0 &&
                          "Media by " +
                            article.dominantMedia.authors
                              .map((mediaAuthor) => mediaAuthor.name)
                              .join(", ") +
                            " | The Brown Daily Herald"}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View>
                <Text style={articleStyles.author}>
                  {article.authors.map((author, i) => (
                    <TouchableOpacity
                      key={author.slug}
                      onPress={() =>
                        navigation.navigate("Staff", { slug: author.slug })
                      }
                      accessible={true}
                      accessibilityHint="View Author's Profile"
                    >
                      <Text style={articleStyles.author}>
                        {author.name}
                        {i < article.authors.length - 1 ? ", " : ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Text>

                <View style={articleStyles.publishedDetails}>
                  <Text
                    style={articleStyles.publishedDetailsText}
                    accessibilityLabel="Published Date"
                  >
                    {formatDates(article.published_at)}
                  </Text>
                </View>
              </View>

              <SplitArticle content={article.content} />
            </View>
            <View style={{ height: 80 }}></View>
          </ScrollView>
        </View>
      </TapGestureHandler>

      {/* Animate the BottomBar */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          transform: [{ translateY }],
        }}
      >
        <BottomBar
          published_at={article.published_at}
          slug={article.slug}
          uuid={article.uuid}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

export default ArticleScreen;
