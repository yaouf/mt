import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { menuStyles } from 'src/styles/sectionMenu';
import { baseStyles, text, varGray1 } from 'src/styles/styles';
import { NavProp } from 'src/types/navStacks';
import { MenuItem } from 'src/types/other';
import { setAsync } from 'src/utils/helpers';
import { MenuContext } from '../HomeStackScreen';

function SectionPrefScreen({ navigation }: NavProp) {
  const { original, sectionMenu, setSectionMenu } = useContext(MenuContext);
  const [preferences, setPreferences] = useState<MenuItem[]>(sectionMenu && sectionMenu.length > 0 ? sectionMenu : original);
  const [removed, setRemoved] = useState<MenuItem[]>(
    original.filter(
      (item) => !(preferences && preferences.some((pref) => pref.slug === item.slug))
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
    // Ensure all original items are present before saving
    const updatedPreferences = [...preferences];
    
    // Check if any original items are missing and add them
    original.forEach(item => {
      if (!updatedPreferences.some(pref => pref.slug === item.slug)) {
        updatedPreferences.push(item);
      }
    });
    
    setSectionMenu(updatedPreferences);
    setAsync('sectionMenu', JSON.stringify(updatedPreferences)); // update async
    navigation.pop();
  };

  const hasChanges = () => {
    if (preferences.length !== sectionMenu.length) return true;
    return preferences.some((pref, index) => pref.slug !== sectionMenu[index].slug);
  };

  const renderItem = ({ item, drag }: RenderItemParams<MenuItem>) => {
    return (
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={100}
        style={[menuStyles.rowItem, { height: itemHeight }]}
      >
        <Text style={menuStyles.rowText}>{item.title}</Text>
        <Ionicons name="reorder-three-outline" size={28} color="#1C1B1F" style={menuStyles.icon} />
      </TouchableOpacity>
    );
  };

  const [marginBottom, setMarginBottom] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);

  const handleSpacing = (event: { nativeEvent: { layout: { height: number } } }) => {
    handleMarginBottom(event);
    handleItemHeight(event);
  };

  const handleMarginBottom = (event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    setMarginBottom(
      -0.00000027978270723040324 * height ** 5 +
        0.00011976263557865468 * height ** 4 -
        0.018384847987277304 * height ** 3 +
        1.2097381613026015 * height ** 2 -
        29.877768847139869 * height +
        228.83862884458455
    );
  };

  const handleItemHeight = (event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight((height * 40) / 22);
  };

  return (
    <GestureHandlerRootView style={[baseStyles.container, { marginBottom: marginBottom }]}>
      <View style={[{ marginTop: 12, flexWrap: 'wrap' }, menuStyles.header]}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          accessible={true}
          accessibilityLabel="Close Section Prefences Menu"
          accessibilityHint="Close the section preferences screen without saving new preferences"
          style={{ paddingHorizontal: 10 }}
        >
          <MaterialIcons name="close" size={28} color="#1C1B1F" />
        </TouchableOpacity>

        <Text style={[menuStyles.otherText, { fontSize: 20, fontWeight: 600 }]}>
          Section Preferences
        </Text>

        <TouchableOpacity
          onPress={applyChanges}
          disabled={!hasChanges()}
          accessible={true}
          accessibilityLabel="Apply Section Preferences"
          accessibilityHint="Apply new section preferences"
          style={{ paddingHorizontal: 10 }}
        >
          <MaterialIcons name="check" size={28} color={hasChanges() ? '#1C1B1F' : varGray1} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 1, backgroundColor: 'black', marginVertical: 5 }} />

      <NestableScrollContainer
        style={[menuStyles.contentContainer, { marginRight: -20 }]}
        scrollIndicatorInsets={{ right: 4 }}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <View>
          <Text style={[{ marginBottom: 12 }, text.sectionHeader3]} onLayout={handleSpacing}>
            Favorite Sections
          </Text>
          <Text style={[menuStyles.descriptionText]}>
            Reorder sections to customize your home page.
          </Text>
          {/* TODO: do we need a lock icon? */}
          <View style={[menuStyles.rowItem, { height: itemHeight }]}>
            {/* <MaterialIcons
              name="lock-outline"
              size={28}
              color={varGray1}
              style={menuStyles.icon}
            /> */}
            <Text style={[menuStyles.rowText, { color: varGray1 }]}>ALL</Text>
          </View>
          <NestableDraggableFlatList
            data={preferences}
            onDragEnd={({ data }) => setPreferences(data)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={true}
            accessibilityLabel="Favorite Sections"
            accessibilityHint="Drag and drop sections to reorder them"
          />
        </View>

        {/* Removed the "Removed Sections" section since we're ensuring all sections are always included */}

        <TouchableOpacity
          onPress={() => {
            setPreferences([...original]);
          }}
          style={[menuStyles.rowItem, menuStyles.reset, { height: itemHeight }]}
        >
          <Text style={menuStyles.otherText}>Reset to Default Order</Text>
        </TouchableOpacity>
      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
}

export default SectionPrefScreen;
