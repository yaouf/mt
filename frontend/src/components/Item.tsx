import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface ItemProps {
  item: {
    headline: string;
    uuid: string;
    subhead: string;
    content: string;
    created_at: string;
    modified_at: string;
    published_at: string;
    metadata?: object; // Optional Params
    ssts_id?: string; // Optional Params
    // also tags and authors and more
  };
}

/**
 * Component to display a search result
 *
 * @param props - ItemProps
 * @returns a search item
 */
function Item({ item }: ItemProps) {
  // link is www.browndailyherald.com/uuid

  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() => console.log("https://browndailyherald.com/" + item.uuid)}
    >
      <Text style={styles.itemTitle}>{item.headline}</Text>
      <Text>{item.content.substring(0, 100)}</Text>
      {/* {item.metadata && <Text>Metadata: {JSON.stringify(item.metadata)}</Text>}
      {item.ssts_id && <Text>SSTS ID: {item.ssts_id}</Text>} */}
    </Pressable>
  );
}

export default Item;

const styles = StyleSheet.create({
  itemContainer: { margin: 20 },
  itemTitle: { color: "brown" },
});
