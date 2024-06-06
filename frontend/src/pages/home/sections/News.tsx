import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import SectionHeader from "src/components/SectionHeader";
import Divider from "src/components/Divider";
import { layout } from "src/styles/styles";

function News({ navigation }: NavProp) {
  const [news, setNews] = useState<Article[]>();
  const viewMore = () => {
    console.log(`view News section`);
  };

  useEffect(() => {
    fetchSectionHome("university-news", 5, setNews).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <SectionHeader title={"News"} onSeeMorePress={viewMore} />
      {!news ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {news.slice(0, 2).map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={navigation}
                key={`news-home-${i}`}
              />
            ))}
          </View>
          <View style={layout.vStack}>
            {news.slice(2).map(
              (
                article: Article,
                i // rest as horizontal
              ) => (
                <HorizontalCard
                  article={article}
                  navigation={navigation}
                  key={`news-home-${i + 2}`}
                />
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default News;
