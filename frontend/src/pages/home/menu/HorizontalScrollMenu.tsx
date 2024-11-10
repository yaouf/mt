import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useEffect, useRef } from "react";
import {
  PixelRatio,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { menuStyles } from "src/styles/sectionMenu";
import { NavProp } from "src/types/navStacks";
import { setAsync } from "src/utils/helpers";
import { menuItems } from "src/utils/setupDevice";
import { MenuContext } from "../HomeStackScreen";

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection, setSectionMenu } =
    useContext(MenuContext);

    const scrollViewRef = useRef<ScrollView>(null);

  if (!sectionMenu) {
    setSectionMenu(menuItems);
    setAsync("sectionMenu", JSON.stringify(menuItems));
  }

  const textSizeMultiplier = PixelRatio.getFontScale();
  console.log("textSizeMultiplier", textSizeMultiplier);
  const calculatedIconSize = 24* Math.sqrt(textSizeMultiplier);
  console.log("calculatedIconSize", calculatedIconSize);

  useEffect(() => {
    // Need to wait for layout to complete before scrolling
    setTimeout(() => {
      const allButton = currSection === "all" ? 1 : 0;
      const currentIndex = sectionMenu.findIndex(item => item.slug === currSection);
      
      // Calculate approximate position (may need to adjust these values later)
      const itemWidth = 80; // Approximate width of each menu item
      const scrollPosition = (currentIndex + allButton) * itemWidth;
      
      scrollViewRef.current?.scrollTo({
        x: scrollPosition,
        animated: true
      });
    }, 100);
  }, [currSection]);



  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ borderBottomWidth: 1, borderColor: "#ccc" }}
      accessibilityLabel="Section menu"
      accessibilityHint="Scroll horizontally to view different BDH sections"
    >
      <TouchableOpacity
        key={1}
        style={[menuStyles.menuItem, { paddingLeft: 20 }]}
        onPress={() => navigation.push("SectionPref")}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Filter options"
      >
        <Ionicons name="filter-outline" size={calculatedIconSize} color="black" />
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
