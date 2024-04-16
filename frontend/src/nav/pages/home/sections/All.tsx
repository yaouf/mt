import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import SmallCard from "src/components/cards/SmallCard";
import LargeCard from "../../../../components/cards/LargeCard";
import type { PropsWithChildren } from "react";
import { Article } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";

const All = () => {
  const [topStories, setTopStories] = useState<Article[]>();

  useEffect(() => {
    fetchSectionHome("homepage", 5, setTopStories).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View style={styles.large}>
      <Text style={styles.title}>Top Stories</Text>
      {!topStories ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <View>
          <LargeCard article={topStories[0]} />
          <PreviewLayout columnGap={16} rowGap={16}>
            {/* NOTE: it's better to map them because sometimes we won't have 5 stories (slice because display 1st elt already as large card*/}
            {topStories.slice(1).map((article: Article) => (
              <SmallCard article={article} />
            ))}
            {/* <SmallCard article={topStories[1]} />
        <SmallCard article={topStories[2]} />
        <SmallCard article={topStories[3]} />
        <SmallCard article={topStories[4]} /> */}
          </PreviewLayout>
        </View>
      )}
    </View>
  );
};

type PreviewLayoutProps = PropsWithChildren<{
  columnGap: number;
  rowGap: number;
}>;

const PreviewLayout = ({ children, rowGap, columnGap }: PreviewLayoutProps) => (
  <View style={styles.previewContainer}>
    <View style={[styles.container, { rowGap, columnGap }]}>{children}</View>
  </View>
);

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  previewContainer: { padding: 10, flex: 1, alignItems: "center" },
  container: {
    flex: 1,
    marginTop: 4,
    maxHeight: 470,
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  large: {
    flex: 1,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
  },
});

export default All;
