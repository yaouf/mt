import SmallCard from "src/components/cards/SmallCard";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PropsWithChildren } from "react";
import { dummyData } from "src/dummyData";
import { Article } from "src/types/types";
import { fetchSectionHome } from "src/code/fetchContent";

const News = () => {
  const [universityNews, setUniversityNews] = useState<Article[]>();

  useEffect(() => {
    fetchSectionHome("university-news", 5, setUniversityNews).then(() =>
      console.log("loaded content")
    );
  }, []);

  return (
    <View>
      <Text style={styles.title}>News</Text>
      {!universityNews ? (
        <Text>Loading!!</Text> // for first load when undefined, eventually will replace with a nice loading sign
      ) : (
        <PreviewLayout columnGap={16} rowGap={16}>
          {universityNews.slice(1).map((article: Article) => (
            <SmallCard article={article} />
          ))}
        </PreviewLayout>
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

const styles = StyleSheet.create({
  previewContainer: { padding: 10, flex: 1, alignItems: "center" },
  container: {
    flex: 1,
    marginTop: 4,
    maxHeight: 470,
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
    margin: 16,
  },
});

export default News;
