import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { homeStyles } from "src/styles/home";
import Divider from "src/components/Divider";

function Metro({ navigation }: NavProp) {
  const [metro, setMetro] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view Metro section`);
  };

  useEffect(() => {
    fetchSectionHome("metro", 4, setMetro).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title="Metro" onSeeMorePress={viewMore} />
      {!metro ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={homeStyles.grid}>
            {metro.map((article: Article) => (
              <SmallCard article={article} navigation={navigation}/>
            ))}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default Metro;
