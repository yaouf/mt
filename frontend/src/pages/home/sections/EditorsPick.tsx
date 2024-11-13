import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import SearchCard from "src/components/cards/SearchCard";
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
function EditorsPicksComponent(props: TopProps) {
  return (
    <View style={baseStyles.container}>
      <Text
        style={{
          fontWeight: "600",
          color: "#323232",
          fontSize: 17.5,
          paddingTop: 25,
        }}
      >
        Editors' Picks
      </Text>
      {props.topStories == undefined ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // paddingLeft: 10,
            paddingBottom: 30,
            overflow: "visible",
          }}
        >
          {props.topStories?.map(
            (
              article: Article,
              i // rest as horizontal
            ) => (
              <View
                style={{
                  width: 300,
                  marginRight: 15,
                }}
              >
                <SearchCard
                  article={article}
                  navigation={props.navigation}
                  key={`search-editors-${i}`}
                />
              </View>
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default EditorsPicksComponent;
