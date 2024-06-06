import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import Divider from "src/components/Divider";
import { layout } from "src/styles/styles";

function ScienceResearch({ navigation }: NavProp) {
  const [scienceResearch, setScienceResearch] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view ScienceResearch section`);
  };

  useEffect(() => {
    fetchSectionHome("science-research", 2, setScienceResearch).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title={"Science & Research"} onSeeMorePress={viewMore} />
      {!scienceResearch ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {scienceResearch.map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`science-research-home-${i}`}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default ScienceResearch;
