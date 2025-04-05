import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import ImageCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";
import { useTheme } from "src/components/ThemeContext";
import { baseStyles, darkStyles } from "src/styles/styles";
import { Article } from "src/types/data";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  mostPopularStories: Article[] | undefined;
};

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function MostPopular(props: Readonly<TopProps>) {
  const { isDarkMode, toggleTheme } = useTheme();
  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  return (
    <>
      {props.mostPopularStories && props.mostPopularStories.length > 0 && (
        <View style={[containerStyle.container, { paddingVertical: 15 }]}>
          <Text
            style={{
              fontWeight: "600",
              color: "#323232",
              fontSize: 17.5,
            }}
          >
            Most Popular
          </Text>
          <View
            style={{ overflow: "visible", paddingTop: 15, paddingBottom: 60 }}
          >
            <View style={{}}>
              {props.mostPopularStories?.map((article, index) => (
                <View style={{}} key={`search-popular-${article.id}`}>
                  {/* Actually a vertical card */}
                  <ImageCard
                    article={article}
                    navigation={props.navigation}
                    key={`search-popular-${article.id}`}
                  />
                  {props.mostPopularStories &&
                    index !== props.mostPopularStories.length - 1 && (
                      <Divider />
                    )}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default MostPopular;
