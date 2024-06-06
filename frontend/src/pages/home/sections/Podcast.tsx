import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import Divider from "src/components/Divider";
import { layout } from "src/styles/styles";

function Podcast({ navigation }: NavProp) {
  const [podcast, setPodcast] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view podcast section`);
  };

  useEffect(() => {
    fetchSectionHome("podcasts", 4, setPodcast).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title="Podcast" onSeeMorePress={viewMore} />
      {!podcast ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {podcast.map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`podcast-home-${i}`}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default Podcast;
