import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
    RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { font2 } from "src/styles/styles";
import { MaterialCommunityIcons} from '@expo/vector-icons';

// ScaleDecorator enlarges item past horizontal borders when dragged, loses rounded corners

const NUM_ITEMS = 7;

type Item = {
  key: string;
  label: string;
  height: number;
  width: string;
  backgroundColor: string;
};

const menuItems = ['NEWS', 'SPORTS', 'ARTS & CULTURE', 'SCIENCE & RESEARCH', 'OPINIONS', 'PROJECTS', 'POST-MAGAZINE',  'MULTIMEDIA']

const initialData: Item[] = Array.from({ length: NUM_ITEMS }, (_, index) => ({
  key: `${index}`,
  label: String(menuItems[index + 1]),
  height: 100,
  width: "99%",
  backgroundColor: "white", // set first item to black, rest to white
}));

export default function App() {
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: "white" ,
            marginVertical: 10,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10, 
            },
          ]}
        >
          <Text style={styles.text}>{item.label}</Text>
          <MaterialCommunityIcons name="drag-horizontal-variant" size={30} color="black" style={styles.icon}/>
        </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
    </GestureHandlerRootView>
  );
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  rowItem: {
    height: 40,
    width: "99%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text: {
    color: "black",
    textAlign: "left",
    fontFamily: font2,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 38,
    marginLeft: 50
  },
  icon: {
    marginTop: 5, 
  },
});