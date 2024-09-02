import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SectionGroupProps } from "src/types/navStacks";
import { Article } from "src/types/data";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { baseStyles, layout, varGray1 } from "src/styles/styles";
import HorizontalCard from "src/components/cards/HorizontalCard";
import Divider from "src/components/Divider";

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function SmallHorzGroup(props: SectionGroupProps) {
  const [articles, setArticles] = useState<Article[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data: Article[] = await fetchSectionHome(
        props.slug,
        props.count + 5
      );
      const filtered: Article[] = data.filter(
        (a) => !props.top.includes(a.uuid)
      );
      setArticles(filtered.slice(0, props.count));
      setLoading(false);
    };

    fetchData();
    console.log("fetched", props.slug);
  }, []);

  return (
    <View style={baseStyles.container}>
      <SectionHeader
        title={props.title}
        slug={props.slug}
        navigation={props.navigation}
      />
      {loading ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <View style={{ overflow: "visible" }}>
          <View>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {articles.slice(0, 2).map((article: Article, i) => (
              <View><SmallCard
                article={article}
                navigation={props.navigation}
                key={`news-home-${i}`}
              /><Divider /></View>
            ))}
          </View>
          <View style={{}}>
            {articles.slice(2).map(
              (
                article: Article,
                i // rest as horizontal
              ) => (
                <View style={{}}><HorizontalCard
                  article={article}
                  navigation={props.navigation}
                  key={`news-home-${i + 2}`}
                /><Divider /></View>
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default SmallHorzGroup;
