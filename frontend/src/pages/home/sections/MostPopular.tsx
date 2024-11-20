import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
<<<<<<< HEAD
import { ActivityIndicator, Text, View } from "react-native";
import HorizontalCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";
import { baseStyles, varGray1 } from "src/styles/styles";
=======
import { Text, View } from "react-native";
import HorizontalCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";
import { baseStyles } from "src/styles/styles";
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
import { Article } from "src/types/data";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
<<<<<<< HEAD
  topStories: Article[];
=======
  mostPopularStories: Article[] | undefined;
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
};

/**
 * Section with all small cards
 * @param props
 * @returns
 */
<<<<<<< HEAD
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
=======
function MostPopular(props: Readonly<TopProps>) {
  return (
    <>
      {props.mostPopularStories && props.mostPopularStories.length > 0 && (
        <View style={[baseStyles.container, { paddingVertical: 15 }]}>
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
                  <HorizontalCard
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
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
  );
}

export default MostPopular;
