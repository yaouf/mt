import { useContext } from "react";
import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/types";
import { menuStyles } from "src/styles/sectionMenu";
import { MenuContext } from "../HomeStackScreen";

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection } = useContext(MenuContext);

  console.log("curr section", currSection);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        key={1}
        style={styles.menuItem}
        onPress={() => navigation.push("SectionPref")}
      >
        <Ionicons name="filter-outline" size={24} color="black" />
      </TouchableOpacity>

      {currSection === "all" ? (
        <Text style={menuStyles.menuItemSelected}>all</Text>
      ) : (
        <TouchableOpacity
          key={2}
          style={styles.menuItem}
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
          <Text style={menuStyles.menuItemSelected}>{menuItem.title}</Text>
        ) : (
          <TouchableOpacity
            key={menuItem.id}
            style={styles.menuItem}
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

const styles = StyleSheet.create({
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: "white",
    marginHorizontal: 0,
  },
  menuItemText: {},
});

export default HorizontalScrollMenu;
