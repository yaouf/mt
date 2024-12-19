import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { fetchSection } from "src/api/fetchContent";
import HorizontalCard from "src/components/cards/HorizontalCard";
import LargeSectionCard from "src/components/cards/LargeSectionCard";
import SmallCard from "src/components/cards/SmallCard";
import Divider from "src/components/Divider";
import { Article } from "src/types/data";
import { HomeStackProps } from "src/types/navStacks";
import { baseStyles, layout, text, varGray1 } from "../../styles/styles";

// TODO: if reach the end of the list, load the next page of content
// (another api call but with page= page+ 1 unless page=last page)

function SectionsScreen({
  route,
  navigation,
}: StackScreenProps<HomeStackProps, "Section">) {
  const slug = route.params.slug;
  const [section, setSection] = useState<Article[]>();
  const [title, setTitle] = useState();
  const [pages, setPages] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSection(undefined);
    setTitle(undefined);
    setPages(undefined);

    fetchSection(slug, 1, setSection).then((resp) => {
      setTitle(resp[0]);
      setPages(resp[1]);
      console.log(`loaded ${slug}`);
    });
  }, [slug]);

  if (!section) {
    return <ActivityIndicator color={varGray1} style={{ flex: 1 }} />;
  }

  // switch every 4
  // small 1,2,3,4
  // horz 5,6,7,8
  // small 9,10,11,12 ...

  let cards = "small";

  const renderCards = (index: number) => {
    if (index === 0) {
      return (
        <View>
          <LargeSectionCard
            article={section[0]}
            navigation={navigation}
            key={`${slug}-0}`}
          />
          <Divider />
        </View>
      );
    } else if (index === 1 || (cards === "small" && (index + 1) % 2 === 0)) {
      cards = "horizontal";
      return (
        <View style={layout.vStack}>
          {section.slice(index, index + 2).map((article, i) => (
            <View>
              <SmallCard
                article={article}
                navigation={navigation}
                key={`${slug}-small-${index}-${i}`}
              />
              <Divider />
            </View>
          ))}
        </View>
      );
    } else if (cards === "horizontal" && (index + 1) % 2 === 0) {
      cards = "small";
      return (
        <View style={layout.vStack}>
          {section.slice(index, index + 2).map((article, i) => (
            <View>
              <HorizontalCard
                article={article}
                navigation={navigation}
                key={`${slug}-horizontal-${index}-${i}`}
              />
              <Divider />
            </View>
          ))}
        </View>
      );
    } else {
      return null; // render only every 4
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSection(slug, 1, setSection);
    setRefreshing(false);
  };

  return (
    <View>
      <View style={baseStyles.container}>
        <View>
          <FlatList
            data={section}
            keyExtractor={(item, index) => `${slug}-${index}`}
            renderItem={({ item, index }) => renderCards(index)}
            ListHeaderComponent={<Text style={text.bigTitle}>{title}</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollIndicatorInsets={{ right: 4 }}
            contentContainerStyle={{ paddingRight: 20 }}
            style={{ marginRight: -20 }}
          />
        </View>
      </View>
    </View>
  );
}

export default SectionsScreen;
