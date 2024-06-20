import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, Text } from "react-native";
import LargeCard from "../../../components/cards/LargeCard";
import { Article } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SmallCard from "src/components/cards/SmallCard";
import { layout, text } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  topStories: Article[];
};

function Top(props: TopProps) {
  return (
    <View style={{ overflow: "visible" }}>
      <Text style={text.bigTitle}>Top Stories</Text>
      <View style={{ overflow: "visible" }}>
        <LargeCard
          article={props.topStories[0]}
          navigation={props.navigation}
          key={`top-home-0}`}
        />
        <View style={layout.grid}>
          {props.topStories.slice(1).map((article: Article, i) => (
            <SmallCard
              article={article}
              navigation={props.navigation}
              key={`top-home-${i + 1}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default Top;
