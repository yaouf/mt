import { useContext } from "react";
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

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection, setSectionMenu } =
    useContext(MenuContext);

  if (!sectionMenu) {
    setSectionMenu(menuItems);
    setAsync("sectionMenu", JSON.stringify(menuItems));
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        key={1}
        style={menuStyles.menuItem}
        onPress={() => navigation.push("SectionPref")}
      >
        <Ionicons name="filter-outline" size={24} color="black" />
      </TouchableOpacity>

      {currSection === "all" ? (
        <View style={menuStyles.menuItem}>
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
        >
          <Text style={menuStyles.menuItemText}>all</Text>
        </TouchableOpacity>
      )}

      {sectionMenu.map((menuItem) =>
        menuItem.slug === currSection ? (
          <View style={menuStyles.menuItem}>
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
          >
            <Text style={menuStyles.menuItemText}>{menuItem.title}</Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
}

export default HorizontalScrollMenu;
