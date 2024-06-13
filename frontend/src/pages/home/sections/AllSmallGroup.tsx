import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Article, SectionGroupProps } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";
import SectionHeader from "src/components/SectionHeader";
import { layout } from "src/styles/styles";

/**
 * Section with all small cards
 * @param props
 * @returns
 */
function AllSmallGroup(props: SectionGroupProps) {
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
    console.log('fetched', props.slug)
    // fetchSectionHome(props.slug, props.count + 5, setArticles).then(() =>
    //   console.log(`loaded content for ${props.title}`)
    // );
  }, []);

  return (
    <View>
      <SectionHeader title={props.title} onSeeMorePress={viewMore} />
      {loading ? (
        <Text>Loading!!</Text> // for first load when undefined, TODO: eventually replace with a nice loading sign
      ) : (
        <View>
          <View style={layout.grid}>
            {articles.map((article: Article, i) => (
              <SmallCard
                article={article}
                navigation={props.navigation}
                key={`${props.slug}-home-${i}`}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default AllSmallGroup;
