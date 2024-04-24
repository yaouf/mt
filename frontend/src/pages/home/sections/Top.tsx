import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LargeCard from "../../../components/cards/LargeCard";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import { homeStyles } from "src/styles/home";
import Divider from "src/components/Divider";
import SmallCard from "src/components/cards/SmallCard";

function Top({ navigation }: NavProp) {
  const [topStories, setTopStories] = useState<Article[]>();

  useEffect(() => {
    fetchSectionHome("homepage", 5, setTopStories).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <Text style={homeStyles.top}>Top Stories</Text>
      {!topStories ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <LargeCard article={topStories[0]} navigation={navigation} />
          <View style={homeStyles.grid}>
            {topStories.slice(1).map((article: Article) => (
              <SmallCard article={article} navigation={navigation} />
            ))}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default Top;
