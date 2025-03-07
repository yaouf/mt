import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import SmallCardTop from "src/components/cards/SmallCardTop";
import SmallPhotoCardTop from "src/components/cards/SmallPhotoCardTop";
import Divider from "src/components/Divider";
import { baseStyles, darkModeText, darkStyles, text } from "src/styles/styles";
import { Article } from "src/types/data";
import LargeCard from "../../../components/cards/LargeCard";
import { useTheme } from "src/components/ThemeContext";

type TopProps = {
  navigation: StackNavigationProp<any, any>;
  topStories: Article[];
};

function Top(props: TopProps) {
  // Early return if no stories
  if (!props.topStories || props.topStories.length === 0) {
    return null;
  }
  const { isDarkMode, toggleTheme } = useTheme();
  
    const containerStyle = isDarkMode ? darkStyles : baseStyles;
    const textStyle = isDarkMode ? darkModeText : text;
  return (
    <View style={containerStyle.container}>
      <View style={{ overflow: "visible" }}>
        <LargeCard
          article={props.topStories[0]}
          navigation={props.navigation}
          key={`top-home-0}`}
        />
        <Divider />
        <View style={{backgroundColor:containerStyle.container.backgroundColor}}>
          {props.topStories.slice(1, 2).map((article: Article, i) => (
            <View key={`top-home-${i + 1}`}>
              <SmallPhotoCardTop
                article={article}
                navigation={props.navigation}
                key={`top-home-${i + 1}`}
              />
              <Divider />
            </View>
          ))}
        </View>
        <View style={{backgroundColor:containerStyle.container.backgroundColor}}>
          {props.topStories.slice(2, 4).map((article: Article, i) => (
            <View key={`top-home-${i + 1}`}>
              <SmallCardTop
                article={article}
                navigation={props.navigation}
                key={`top-home-${i + 1}`}
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
