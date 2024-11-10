import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import HorizontalCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";
import { baseStyles, varGray1 } from "src/styles/styles";
import { Article } from "src/types/data";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  topStories: Article[];
};

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function MostPopular(props: TopProps) {
  return (
    <View style={baseStyles.container}>
      <Text
        style={{
          fontWeight: "600",
          color: "#323232",
          fontSize: 17.5,
        }}
      >
        Most Popular
      </Text>
      {props.topStories == undefined ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <View
          style={{ overflow: "visible", paddingTop: 30, paddingBottom: 50 }}
        >
          <View style={{}}>
            {props.topStories?.map(
              (
                article: Article,
                i // rest as horizontal
              ) => (
                <View style={{}} key={`search-popular-${i}`}>
                  <HorizontalCard
                    article={article}
                    navigation={props.navigation}
                    key={`search-popular-${i}`}
                  />
                  <Divider />
                </View>
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default MostPopular;
