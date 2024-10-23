import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { fetchSectionHome } from "src/api/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import LargeSectionCard from "src/components/cards/LargeSectionCard";
import Divider from "src/components/Divider";
import SectionHeader from "src/components/SectionHeader";
import { baseStyles, varGray1 } from "src/styles/styles";
import { Article } from "src/types/data";
import { SectionGroupProps } from "src/types/navStacks";

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
            {/* // first as large card, second as small card TODO: can we always assume at least 2?? */}
            {articles.slice(0, 1).map((article: Article, i) => (
              <View><LargeSectionCard
                article={article}
                navigation={props.navigation}
                key={`news-home-${i}`}
              /><Divider /></View>
            ))}
            {articles.slice(1, 2).map((article: Article, i) => (
              <View><LargeSectionCard
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
