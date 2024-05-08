import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { font2 } from "src/styles/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

// ScaleDecorator enlarges item past horizontal borders when dragged, loses rounded corners

const NUM_ITEMS = 7;

type Item = {
  key: string;
  label: string;
  height: number;
  width: string;
  backgroundColor: string;
};

const menuItems = [
  "NEWS",
  "SPORTS",
  "ARTS & CULTURE",
  "SCIENCE & RESEARCH",
  "OPINIONS",
  "PROJECTS",
  "POST-MAGAZINE",
  "MULTIMEDIA",
];

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
          {
            height: 40,
            backgroundColor: "white",
            marginVertical: 6,
            borderRadius: 10,
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingLeft: 16,
          },
        ]}
      >
        <Foundation
          name="minus-circle"
          size={24}
          color="#ED1C24"
          style={styles.minusIcon}
        />
        <View>
          <Text style={styles.text}>{item.label}</Text>
        </View>
        <MaterialCommunityIcons
          name="drag-horizontal-variant"
          size={24}
          color="#1C1B1F"
          style={styles.dragIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.rectangle}>
        <MaterialIcons
          name="lock-outline"
          size={24}
          color="#9E9E9E"
          style={styles.lockIcon}
        />
        <Text style={styles.grayText}>TOP STORIES</Text>
      </View>
      <View style={styles.rectangle}>
        <MaterialIcons
          name="lock-outline"
          size={24}
          color="#9E9E9E"
          style={styles.lockIcon}
        />
        <Text style={styles.grayText}>ALL</Text>
      </View>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </GestureHandlerRootView>
  );
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  rowItem: {
    height: 40,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  rectangle: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "black",
    textAlign: "left",
    fontFamily: font2,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: 38,
    marginLeft: 16,
    flex: 1,
  },
  grayText: {
    color: "#9E9E9E",
    textAlign: "left",
    fontFamily: font2,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: 38,
    marginLeft: 16,
    flex: 1,
  },
  dragIcon: {
    marginTop: 8,
    marginLeft: "auto",
    marginRight: 8,
  },
  minusIcon: {
    marginTop: 8,
  },
  lockIcon: {
    marginLeft: 12,
  },
});
