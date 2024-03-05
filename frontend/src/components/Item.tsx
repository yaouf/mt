// item.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ItemProps {
  item: {
    headline: string;
    content: string;
    metadata?: object; // Optional Params
    ssts_id?: string; // Optional Params
  };
}

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.headline}</Text>
      <Text>{item.content}</Text>
      {/* {item.metadata && <Text>Metadata: {JSON.stringify(item.metadata)}</Text>}
      {item.ssts_id && <Text>SSTS ID: {item.ssts_id}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {},
  itemTitle: { color: "brown" },
});

export default Item;
