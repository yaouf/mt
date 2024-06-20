import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Article, SectionGroupProps } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { layout, varGray1 } from "src/styles/styles";
import HorizontalCard from "src/components/cards/HorizontalCard";

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function SmallHorzGroup(props: SectionGroupProps) {
  const [articles, setArticles] = useState<Article[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const viewMore = () => {
    props.navigation.push("Section", { slug: props.slug });
  };

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
    <View>
      <SectionHeader
        title={props.title}
        slug={props.slug}
        navigation={props.navigation}
      />
      {loading ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <View>
          <View style={layout.grid}>
            {/* // first two as small cards TODO: can we always assume at least 2?? */}
            {articles.slice(0, 2).map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={props.navigation}
                key={`news-home-${i}`}
              />
            ))}
          </View>
          <View style={layout.vStack}>
            {articles.slice(2).map(
              (
                article: Article,
                i // rest as horizontal
              ) => (
                <HorizontalCard
                  article={article}
                  navigation={props.navigation}
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

export default SmallHorzGroup;
