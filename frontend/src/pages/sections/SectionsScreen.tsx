import { View, Text, ActivityIndicator } from "react-native";
import { baseStyles, layout, text, varGray1 } from "../../styles/styles";
import { useEffect, useState } from "react";
import { fetchSection } from "src/code/fetchContent";
import LargeSectionCard from "src/components/cards/LargeSectionCard";
import SmallCard from "src/components/cards/SmallCard";
import { FlatList } from "react-native-gesture-handler";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackProps } from "src/types/navStacks";
import { Article } from "src/types/data";
import Divider from "src/components/Divider";

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

  useEffect(() => {
    fetchSection(slug, 1, setSection).then((resp) => {
      setTitle(resp[0]);
      setPages(resp[1]);
      console.log(`loaded ${slug}`);
    });
  }, []);

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
        <View><LargeSectionCard
          article={section[0]}
          navigation={navigation}
          key={`${slug}-0}`}
        /><Divider /></View>
      );
    } else if (index === 1 || (cards === "small" && (index + 1) % 2 === 0)) {
      cards = "horizontal";
      return (
        <View style={layout.grid}>
          {section.slice(index, index + 2).map((article, i) => (
            <View>
            <SmallCard
              article={article}
              navigation={navigation}
              key={`${slug}-small-${index}-${i}`}
            /><Divider /></View>
          ))}
        </View>
      );
    } else if (cards === "horizontal" && (index + 1) % 2 === 0) {
      cards = "small";
      return (
        <View style={layout.vStack}>
          {section.slice(index, index + 2).map((article, i) => (
            <View><HorizontalCard
              article={article}
              navigation={navigation}
              key={`${slug}-horizontal-${index}-${i}`}
            /><Divider /></View>
          ))}
        </View>
      );
    } else {
      return null; // render only every 4
    }
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
          />
        </View>
      </View>
    </View>
  );
}

export default SectionsScreen;
