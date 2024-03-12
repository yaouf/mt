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

/**
 * Component to display a search result
 *
 * @param props - ItemProps
 * @returns a search item
 */
function Item({ item }: ItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.headline}</Text>
      <Text>{item.content}</Text>
      {/* {item.metadata && <Text>Metadata: {JSON.stringify(item.metadata)}</Text>}
      {item.ssts_id && <Text>SSTS ID: {item.ssts_id}</Text>} */}
    </View>
  );
}

export default Item;

const styles = StyleSheet.create({
  itemContainer: {},
  itemTitle: { color: "brown" },
});
