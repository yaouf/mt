import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PropsWithChildren } from "react";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import SectionHeader from "src/components/SectionHeader";
import { homeStyles } from "src/styles/home";
import Divider from "src/components/Divider";

function Opinions({ navigation }: NavProp) {
  const [opinions, setOpinions] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view Opinions section`);
  };

  useEffect(() => {
    fetchSectionHome("opinions", 5, setOpinions).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title={"Opinions"} onSeeMorePress={viewMore} />
      {!opinions ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={homeStyles.grid}>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {opinions.slice(0, 2).map((article: Article) => (
              <SmallCard article={article} navigation={navigation}/>
            ))}
          </View>
          <View style={homeStyles.vstack}>
            {opinions.slice(2).map(
              (
                article: Article // rest as horizontal
              ) => (
                <HorizontalCard article={article} navigation={navigation}/>
              )
            )}
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
}

export default Opinions;
