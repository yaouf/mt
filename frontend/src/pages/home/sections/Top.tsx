import { View, Text } from "react-native";
import LargeCard from "../../../components/cards/LargeCard";
import { Article } from "src/types/data";
import SmallCardTop from "src/components/cards/SmallCardTop";
import { baseStyles, layout, text } from "src/styles/styles";
import { StackNavigationProp } from "@react-navigation/stack";
import Divider from "src/components/Divider";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  topStories: Article[];
};

function Top(props: TopProps) {
  return (
    <View style={baseStyles.container}>
      <View style={{ overflow: "visible" }}>
        <LargeCard
          article={props.topStories[0]}
          navigation={props.navigation}
          key={`top-home-0}`}
        /><Divider />
        <View style={{}}>
          {props.topStories.slice(1).map((article: Article, i) => (
            <View><SmallCardTop
              article={article}
              navigation={props.navigation}
              key={`top-home-${i + 1}`}
            /><Divider /></View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Top;
