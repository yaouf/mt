// import React, { useState } from "react";
// import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
// import DraggableFlatList, {
//     RenderItemParams,
//   ScaleDecorator,
// } from "react-native-draggable-flatlist";

// const NUM_ITEMS = 10;

// type Item = {
//   key: string;
//   label: string;
//   height: number;
//   width: number;
//   backgroundColor: string;
// };

// const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
//   return {
//     key: `item-${index}`,
//     label: String(index) + "",
//     height: 100,
//     width: 60 + Math.random() * 40,
//     backgroundColor: "#FFFFFF",
//   };
// });

// export default function Draggable() {
//   const [data, setData] = useState(initialData);

//   const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
//     return (
//       <ScaleDecorator>
//         <TouchableOpacity
//           onPress={drag}
//           disabled={isActive}
//           style={[
//             styles.rowItem,
//             { backgroundColor: isActive ? "red" : item.backgroundColor },
//           ]}
//         >
//           <Text style={styles.text}>{item.label}</Text>
//         </TouchableOpacity>
//       </ScaleDecorator>
//     );
//   };

//   return (
//     <DraggableFlatList
//       data={data}
//       onDragEnd={({ data }) => setData(data)}
//       keyExtractor={(item) => item.key}
//       renderItem={renderItem}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   rowItem: {
//     height: 100,
//     width: 100,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DragList, {DragListRenderItemInfo} from 'react-native-draglist';

const menuItems = ['NEWS', 'SPORTS', 'ARTS & CULTURE', 'SCIENCE & RESEARCH', 'OPINIONS', 'PROJECTS', 'POST-MAGAZINE',  'MULTIMEDIA']

export default function Draggable() {
  const [data, setData] = useState(menuItems);

  function keyExtractor(str: string) {
    return str;
  }

  function renderItem(info: DragListRenderItemInfo<string>) {
    const {item, onDragStart, onDragEnd, isActive} = info;

    return (
      <TouchableOpacity
        key={item}
        onPressIn={onDragStart}
        onPressOut={onDragEnd}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    setData(copy);
  }

  return (
    <View>
      <DragList
        data={data}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
      />
    </View>
  );
}