import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LargeCard from "../../../components/cards/LargeCard";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import Divider from "src/components/Divider";
import SmallCard from "src/components/cards/SmallCard";
import { layout, text } from "src/styles/styles";

function Top({ navigation }: NavProp) {
  const [topStories, setTopStories] = useState<Article[]>();

  useEffect(() => {
    fetchSectionHome("homepage", 5, setTopStories).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <Text style={text.topStories}>Top Stories</Text>
      {!topStories ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <LargeCard
            article={topStories[0]}
            navigation={navigation}
            key={`top-home-0}`}
          />
          <View style={layout.grid}>
            {topStories.slice(1).map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`top-home-${i + 1}`}
              />
            ))}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default Top;
