import { useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/navStacks";
import { menuStyles } from "src/styles/sectionMenu";
import { MenuContext } from "../HomeStackScreen";
import { menuItems } from "src/code/setup";
import { setAsync } from "src/code/helpers";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

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
              navigation.push("Section", { slug: menuItem.slug });
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
