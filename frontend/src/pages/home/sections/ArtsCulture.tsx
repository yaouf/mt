import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import Divider from "src/components/Divider";
import { layout } from "src/styles/styles";

function ArtsCulture({ navigation }: NavProp) {
  const [artsCulture, setArtsCulture] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view Arts Culture section`);
  };

  useEffect(() => {
    fetchSectionHome("arts-culture", 2, setArtsCulture).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title={"Arts & Culture"} onSeeMorePress={viewMore} />
      {!artsCulture ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {artsCulture.map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`arts-culture-home-${i}`}
              />
            ))}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default ArtsCulture;
