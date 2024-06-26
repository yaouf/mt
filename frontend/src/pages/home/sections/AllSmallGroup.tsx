import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SectionGroupProps } from "src/types/navStacks";
import { Article } from "src/types/data";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { layout, varGray1 } from "src/styles/styles";

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function AllSmallGroup(props: SectionGroupProps) {
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
    // fetchSectionHome(props.slug, props.count + 5, setArticles).then(() =>
    //   console.log(`loaded content for ${props.title}`)
    // );
  }, []);

  return (
    <View style={{ overflow: "visible" }}>
      <SectionHeader
        title={props.title}
        slug={props.slug}
        navigation={props.navigation}
      />
      {loading ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <View style={layout.grid}>
          {articles.map((article: Article, i) => (
            <SmallCard
              article={article}
              navigation={props.navigation}
              key={`${props.slug}-home-${i}`}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default AllSmallGroup;
