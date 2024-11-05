import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { fetchSectionHome } from "src/api/fetchContent";
import SmallCard from "src/components/cards/SmallCard";
import Divider from "src/components/Divider";
import OpinionsHeader from "src/components/OpinionsHeader";
import { baseStyles, layout, varGray1 } from "src/styles/styles";
import { Article } from "src/types/data";
import { SectionGroupProps } from "src/types/navStacks";

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function OpinionsGroup(props: SectionGroupProps) {
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
    <View style={baseStyles.container}>
      <OpinionsHeader
        title={props.title}
        slug={props.slug}
        navigation={props.navigation}
      />
      {loading ? (
        <ActivityIndicator color={varGray1} style={{ flex: 1 }} />
      ) : (
        <View style={layout.grid}>
          {articles?.map((article: Article, i) => (
            <View key={`${props.slug}-home-${i}`}>
              <SmallCard
                article={article}
                navigation={props.navigation}
                key={`${props.slug}-home-${i}`}
              />
              <Divider />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default OpinionsGroup;
