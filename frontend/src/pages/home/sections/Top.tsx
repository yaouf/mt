import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import SmallCardTop from "src/components/cards/SmallCardTop";
import SmallPhotoCardTop from "src/components/cards/SmallPhotoCardTop";
import Divider from "src/components/Divider";
import { baseStyles } from "src/styles/styles";
import { Article } from "src/types/data";
import LargeCard from "../../../components/cards/LargeCard";
import { useEffect } from "react";
import Header from "src/components/Header";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  topStories: Article[];
};

function Top(props: TopProps) {
  useEffect(() => {
    props.navigation.getParent()?.setOptions({ headerTitle: () => <Header /> });
  }, []);

  // Early return if no stories
  if (!props.topStories || props.topStories.length === 0) {
    return null;
  }
  return (
    <View style={baseStyles.container}>
      <View style={{ overflow: "visible" }}>
        <LargeCard
          article={props.topStories[0]}
          navigation={props.navigation}
          key={`top-home-0}`}
          inSearch={false}
        />
        <Divider />
        <View style={{}}>
          {props.topStories.slice(1, 2).map((article: Article, i) => (
            <View key={`top-home-${i + 1}`}>
              <SmallPhotoCardTop
                article={article}
                navigation={props.navigation}
                key={`top-home-${i + 1}`}
                inSearch={false}
              />
              <Divider />
            </View>
          ))}
        </View>
        <View style={{}}>
          {props.topStories.slice(2, 4).map((article: Article, i) => (
            <View key={`top-home-${i + 1}`}>
              <SmallCardTop
                article={article}
                navigation={props.navigation}
                key={`top-home-${i + 1}`}
                inSearch={false}
              />
              <Divider />
            </View>
          ))}
        </View>
        <View style={{}}>
          {props.topStories.slice(4, 5).map((article: Article, i) => (
            <View key={`top-home-${i + 1}`}>
              <SmallPhotoCardTop
                article={article}
                navigation={props.navigation}
                key={`top-home-${i + 1}`}
                inSearch={false}
              />
              <Divider />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Top;
