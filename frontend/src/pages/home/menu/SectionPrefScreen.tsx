import { Feather, MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAsync } from "src/code/helpers";
import { menuStyles } from "src/styles/sectionMenu";
import { baseStyles, text, varGray1, varRed } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { MenuItem } from "src/types/other";
import { MenuContext } from "../HomeStackScreen";

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
      <TouchableOpacity onLongPress={drag} style={menuStyles.rowItem} delayLongPress={150}>
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
    //   <GestureHandlerRootView style={baseStyles.container}>
    //     <View style={[{marginTop: 12}, menuStyles.header]}>
    //       <TouchableOpacity onPress={() => navigation.pop()}>
    //         <MaterialIcons name="close" size={24} color="#1C1B1F" />
    //       </TouchableOpacity>

    //       <Text style={menuStyles.otherText}>Section Preferences</Text>

    //       <TouchableOpacity onPress={applyChanges}>
    //         <Text style={[menuStyles.otherText, { fontWeight: 500 }]}>Done</Text>
    //       </TouchableOpacity>
    //     </View>

    //     <ScrollView style={menuStyles.contentContainer}>
    //       <View>
    //       <Text style={[{ marginBottom: 12}, text.sectionHeader1]}>FAVORITE SECTIONS</Text>
    //         <Text style={[menuStyles.descriptionText]}>
    //           Add and reorder topics to customize the menu on your Top Stories
    //           page.
    //         </Text>

    //         <View style={menuStyles.rowItem}>
    //           <MaterialIcons
    //             name="lock-outline"
    //             size={24}
    //             color={varGray1}
    //             style={menuStyles.icon}
    //           />
    //           <Text style={[menuStyles.rowText, { color: varGray1 }]}>ALL</Text>
    //         </View>
    //         <DraggableFlatList
    //           data={preferences}
    //           onDragEnd={({ data }) => setPreferences(data)}
    //           keyExtractor={(item) => item.id.toString()}
    //           renderItem={renderItem}
    //           scrollEnabled={true}
    //         />
    //       </View>

    //       <View>
    //         {removed.length > 0 && (
    //           <Text style={[{ marginBottom: 12, marginTop: 16}, text.sectionHeader1]}>REMOVED SECTIONS</Text>
    //         )}
    //         {removed.map((item) => (
    //           <TouchableOpacity
    //             onPress={() => add(item)}
    //             style={menuStyles.rowItem}
    //             key={`section-${item.id}`}
    //           >
    //             <Feather
    //               name="plus-circle"
    //               size={24}
    //               color="#249607"
    //               style={menuStyles.icon}
    //             />
    //             <Text style={menuStyles.rowText}>{item.title}</Text>
    //           </TouchableOpacity>
    //         ))}
    //       </View>

    //       <TouchableOpacity
    //         onPress={() => {
    //           setPreferences(original);
    //           setRemoved([]);
    //         }}
    //         style={[menuStyles.rowItem, menuStyles.reset]}
    //       >
    //         <Text style={text.resetSectionsButton}>Reset Sections</Text>
    //       </TouchableOpacity>
    //     </ScrollView>
    //   </GestureHandlerRootView>
    // );
    <GestureHandlerRootView style={baseStyles.container}>
      <View style={[{ marginTop: 12 }, menuStyles.header]}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <MaterialIcons name="close" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <Text style={menuStyles.otherText}>Section Preferences</Text>

        <TouchableOpacity onPress={applyChanges}>
          <Text style={[menuStyles.otherText, { fontWeight: 500 }]}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Instead of ScrollView, you can directly have a View or FlatList */}
      <View style={menuStyles.contentContainer}>
        <Text style={[{ marginBottom: 12 }, text.sectionHeader1]}>
          Favorite Sections
        </Text>
        <Text style={menuStyles.descriptionText}>
          Add and reorder topics to customize the menu on your Top Stories page.
        </Text>

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
        />

        <View>
          {removed.length > 0 && (
            <Text
              style={[{ marginBottom: 12, marginTop: 16 }, text.sectionHeader1]}
            >
              Removed Sections
            </Text>
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
          <Text style={text.resetSectionsButton}>Reset Sections</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

export default SectionPrefScreen;
