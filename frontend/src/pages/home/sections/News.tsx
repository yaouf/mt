import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, NavProp } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import SectionHeader from "src/components/SectionHeader";
import { homeStyles } from "src/styles/home";
import Divider from "src/components/Divider";

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
          <View style={homeStyles.grid}>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {news.slice(0, 2).map((article: Article) => (
              <SmallCard article={article} navigation={navigation}/>
            ))}
          </View>
          <View style={homeStyles.vstack}>
            {news.slice(2).map(
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

export default News;
