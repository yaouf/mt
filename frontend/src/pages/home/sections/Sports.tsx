import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import HorizontalCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";
import { layout } from "src/styles/styles";

function Sports({ navigation }: NavProp) {
  const [sports, setSports] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view sports section`);
  };

  useEffect(() => {
    fetchSectionHome("sports", 5, setSports).then(() =>
      console.log("loaded content")
    );
  }, []);
  return (
    <View>
      <SectionHeader title="Sports" onSeeMorePress={viewMore} />
      {!sports ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {sports.slice(0, 2).map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`sports-home-${i}`}
              />
            ))}
          </View>
          <View style={layout.vStack}>
            {sports.slice(2).map(
              (
                article: Article,
                i // rest as horizontal
              ) => (
                <HorizontalCard
                  article={article}
                  navigation={navigation}
                  key={`sports-home-${i + 2}`}
                />
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default Sports;
