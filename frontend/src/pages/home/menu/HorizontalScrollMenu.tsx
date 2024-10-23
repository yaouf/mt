import React, { useContext } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { setAsync } from "src/code/helpers";
import { menuItems } from "src/code/setup";
import { menuStyles } from "src/styles/sectionMenu";
import { NavProp } from "src/types/navStacks";
import { MenuContext } from "../HomeStackScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SectionPrefScreen from "./SectionPrefScreen";

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection, setSectionMenu } =
    useContext(MenuContext);

  if (!sectionMenu) {
    setSectionMenu(menuItems);
    setAsync("sectionMenu", JSON.stringify(menuItems));
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ borderBottomWidth: 1, borderColor: "#ccc" }}
      accessibilityLabel="Section menu"
      accessibilityHint="Scroll horizontally to view different BDH sections"
    >
      <TouchableOpacity
        key={1}
        style={menuStyles.menuItem}
        onPress={() => navigation.push("SectionPref")}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Filter options"
      >
        <Ionicons name="filter-outline" size={24} color="black" />
      </TouchableOpacity>

      
      {currSection === "all" ? (
        <View 
          style={menuStyles.menuItem}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ selected: true }}
          accessibilityLabel="All sections, selected"
        >
          <Text style={menuStyles.menuItemSelected}>all</Text>
        </View>
      ) : (
        <TouchableOpacity
          key={2}
          style={menuStyles.menuItem}
          onPress={() => {
            // TODO: should this also be navigate?
            navigation.popToTop();
            setCurrSection("all");
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="All sections"
          accessibilityHint="Double tap to view all sections"
        >
          <Text style={menuStyles.menuItemText}>all</Text>
        </TouchableOpacity>
      )}

      {sectionMenu.map((menuItem) =>
        menuItem.slug === currSection ? (
          <View 
            key={menuItem.id}
            style={menuStyles.menuItem}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: true }}
            accessibilityLabel={`${menuItem.title} section, selected`}
          >
            <Text style={menuStyles.menuItemSelected}>{menuItem.title}</Text>
          </View>
        ) : (
          <TouchableOpacity
            key={menuItem.id}
            style={menuStyles.menuItem}
            onPress={() => {
              navigation.navigate("Section", { slug: menuItem.slug });
              setCurrSection(menuItem.slug);
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${menuItem.title} section`}
            accessibilityHint={`Double tap to view ${menuItem.title} section`}
          >
            <Text style={menuStyles.menuItemText}>{menuItem.title}</Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
}

export default HorizontalScrollMenu;
