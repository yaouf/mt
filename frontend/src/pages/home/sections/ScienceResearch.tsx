import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { homeStyles } from "src/styles/home";
import Divider from "src/components/Divider";

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
          <View style={homeStyles.grid}>
            {scienceResearch.map((article: Article) => (
              <SmallCard article={article} navigation={navigation}/>
            ))}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default ScienceResearch;
