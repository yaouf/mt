import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
<<<<<<< HEAD
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
=======
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
import SearchCard from "src/components/cards/SearchCard";
import { baseStyles, varGray1 } from "src/styles/styles";
import { Article } from "src/types/data";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
<<<<<<< HEAD
  topStories: Article[];
=======
  editorsPicksStories: Article[];
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
};

/**
 * Section with all small cards
 * @param props
 * @returns
 */
<<<<<<< HEAD
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
=======
function EditorsPick(props: Readonly<TopProps>) {
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
              {props.editorsPicksStories?.map((article, index) => (
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

export default EditorsPick;
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
