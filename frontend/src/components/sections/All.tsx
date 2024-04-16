import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { dummyData } from 'src/dummyData';
import SmallCard from "src/components/cards/SmallCard";
import LargeCard from '../cards/LargeCard';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type {PropsWithChildren} from 'react';


const All = () => {
  return (
    <View style={styles.large} >
      <Text style={styles.title}>Top Stories</Text>
      <LargeCard article={dummyData[0]}/>
      <PreviewLayout
      columnGap={16}
      rowGap={16}>
      <SmallCard article={dummyData[1]} />
      <SmallCard article={dummyData[2]} />
      <SmallCard article={dummyData[3]} />
      <SmallCard article={dummyData[4]} />
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

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  previewContainer: {padding: 10, flex: 1, alignItems: 'center',},
  container: {
    flex: 1,
    marginTop: 4,
    maxHeight: 470,
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  large:{
    flex: 1,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
  },
});

export default All;