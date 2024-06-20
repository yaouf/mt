import { View, Text, ActivityIndicator } from "react-native";
import { Article, SectionProps } from "../../types/types";
import { baseStyles, layout, text, varGray1 } from "../../styles/styles";
import { useEffect, useState } from "react";
import { fetchSection } from "src/code/fetchContent";
import LargeCard from "src/components/cards/LargeCard";
import SmallCard from "src/components/cards/SmallCard";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "src/components/cards/HorizontalCard";

// TODO: if reach the end of the list, load the next page of content
// (another api call but with page= page+ 1 unless page=last page)

function SectionsScreen({ route, navigation }: SectionProps) {
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
        <LargeCard
          article={section[0]}
          navigation={navigation}
          key={`${slug}-0}`}
        />
      );
    } else if (index === 1 || (cards === "small" && (index + 3) % 4 === 0)) {
      cards = "horizontal";
      return (
        <View style={layout.grid}>
          {section.slice(index, index + 4).map((article, i) => (
            <SmallCard
              article={article}
              navigation={navigation}
              key={`${slug}-small-${index}-${i}`}
            />
          ))}
        </View>
      );
    } else if (cards === "horizontal" && (index + 3) % 4 === 0) {
      cards = "small";
      return (
        <View style={layout.vStack}>
          {section.slice(index, index + 4).map((article, i) => (
            <HorizontalCard
              article={article}
              navigation={navigation}
              key={`${slug}-horizontal-${index}-${i}`}
            />
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
