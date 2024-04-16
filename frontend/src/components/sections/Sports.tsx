import SmallCard from "src/components/cards/SmallCard";
import React from 'react';
import {View, Text, StyleSheet,} from 'react-native';
import type {PropsWithChildren} from 'react';
import { dummyData } from 'src/dummyData';

const Sports = () => {

  return (
    <View>
    <Text style={styles.title}>Sports</Text>
    <PreviewLayout
      columnGap={16}
      rowGap={16}>
      <SmallCard article={dummyData[0]} />
      <SmallCard article={dummyData[1]} />
      <SmallCard article={dummyData[2]} />
      <SmallCard article={dummyData[3]} />
    </PreviewLayout>
    </View>
  );
};

type PreviewLayoutProps = PropsWithChildren<{
  columnGap: number;
  rowGap: number;
}>;

const PreviewLayout = ({
  children,
  rowGap,
  columnGap,
}: PreviewLayoutProps) => (
  <View style={styles.previewContainer}>
    <View style={[styles.container, {rowGap, columnGap}]}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  previewContainer: {padding: 10, flex: 1, alignItems: 'center',},
  container: {
    flex: 1,
    marginTop: 4,
    maxHeight: 470,
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
    margin: 16,
  },
});

export default Sports;