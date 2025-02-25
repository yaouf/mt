import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SearchCard from "src/components/cards/SearchCard";
import { baseStyles, varGray1 } from "src/styles/styles";
import { EditorsPickArticle } from "src/types/data";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  editorsPicksStories: EditorsPickArticle[];
};

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function EditorsPicks(props: Readonly<TopProps>) {
  const sortedArticles = [...props.editorsPicksStories].sort(
    (a, b) => a.rank - b.rank
  );

  return (
    <>
      {props.editorsPicksStories && props.editorsPicksStories.length > 0 && (
        <View style={baseStyles.container}>
          <Text
            style={{
              fontWeight: "600",
              color: "#323232",
              fontSize: 17.5,
              paddingTop: 20,
            }}
          >
            Editors' Picks
          </Text>
          {props.editorsPicksStories == undefined ? (
            <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              snapToInterval={315}
              decelerationRate={0}
              contentContainerStyle={{
                // paddingLeft: 10,x
                paddingBottom: 15,
                overflow: "visible",
              }}
            >
              {sortedArticles?.map((article, index) => (
                <View
                  style={[
                    styles.cardContainer,
                    index === props.editorsPicksStories.length - 1 &&
                      styles.lastChild,
                  ]}
                  key={`search-editors-${article.id}`}
                >
                  <SearchCard
                    article={article}
                    navigation={props.navigation}
                    key={`search-editors-${article.id}`}
                    inSearch={true}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    marginRight: 15,
  },
  lastChild: {
    marginRight: 0,
  },
});

export default EditorsPicks;
