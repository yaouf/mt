import { useContext, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { varRed, text, varGray1, baseStyles } from "src/styles/styles";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavProp } from "src/types/navStacks";
import { Feather } from "@expo/vector-icons";
import { menuStyles } from "src/styles/sectionMenu";
import { MenuContext } from "../HomeStackScreen";
import { setAsync } from "src/code/helpers";
import { MenuItem } from "src/types/other";

function SectionPrefScreen({ navigation }: NavProp) {
  const { original, sectionMenu, setSectionMenu } = useContext(MenuContext);
  const [preferences, setPreferences] = useState<MenuItem[]>(sectionMenu);
  const [removed, setRemoved] = useState<MenuItem[]>(
    original.filter(
      (item) => !preferences.some((pref) => pref.slug === item.slug)
    )
  );

  const remove = (item: MenuItem) => {
    const newPref = preferences.filter((elt) => elt !== item);
    setPreferences(newPref);
    setRemoved((prev) => [...prev, item]);
  };

  const add = (item: MenuItem) => {
    const newRem = removed.filter((elt) => elt !== item);
    setRemoved(newRem);
    setPreferences((prev) => [...prev, item]);
  };

  const applyChanges = () => {
    setSectionMenu(preferences);
    setAsync("sectionMenu", JSON.stringify(preferences)); // update async
    navigation.pop();
  };

  const renderItem = ({ item, drag }: RenderItemParams<MenuItem>) => {
    return (
      <TouchableOpacity onLongPress={drag} style={menuStyles.rowItem}>
        <TouchableOpacity onPress={() => remove(item)}>
          <Feather
            name="minus-circle"
            size={24}
            color={varRed}
            style={menuStyles.icon}
          />
        </TouchableOpacity>
        <Text style={menuStyles.rowText}>{item.title}</Text>
        <Ionicons
          name="reorder-three-outline"
          size={24}
          color="#1C1B1F"
          style={menuStyles.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={baseStyles.container}>
      <View style={menuStyles.header}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <MaterialIcons name="close" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <Text style={menuStyles.otherText}>Section Preferences</Text>

        <TouchableOpacity onPress={applyChanges}>
          <Text style={[menuStyles.otherText, { fontWeight: 300 }]}>Apply</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          <Text style={[menuStyles.rowText, { textTransform: "none" }]}>
            Add and reorder topics to customize the menu on your Top Stories
            page.
          </Text>

          <Text style={text.sectionHeader1}>FAVORITE SECTIONS</Text>
          <View style={menuStyles.rowItem}>
            <MaterialIcons
              name="lock-outline"
              size={24}
              color={varGray1}
              style={menuStyles.icon}
            />
            <Text style={[menuStyles.rowText, { color: varGray1 }]}>ALL</Text>
          </View>
          <DraggableFlatList
            data={preferences}
            onDragEnd={({ data }) => setPreferences(data)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>

        <View>
          {removed.length > 0 && (
            <Text style={text.sectionHeader1}>REMOVED SECTIONS</Text>
          )}
          {removed.map((item) => (
            <TouchableOpacity
              onPress={() => add(item)}
              style={menuStyles.rowItem}
              key={`section-${item.id}`}
            >
              <Feather
                name="plus-circle"
                size={24}
                color="#249607"
                style={menuStyles.icon}
              />
              <Text style={menuStyles.rowText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            setPreferences(original);
            setRemoved([]);
          }}
          style={[menuStyles.rowItem, menuStyles.reset]}
        >
          <Text style={text.sectionHeader1}>Reset Sections</Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default SectionPrefScreen;
