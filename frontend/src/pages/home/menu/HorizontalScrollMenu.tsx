import { useContext, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { setAsync } from "src/code/helpers";
import { menuItems } from "src/code/setup";
import { menuStyles } from "src/styles/sectionMenu";
import { NavProp } from "src/types/navStacks";
import { MenuContext } from "../HomeStackScreen";

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection, setSectionMenu } =
    useContext(MenuContext);
  const scrollViewRef = useRef<ScrollView>(null);
  // const itemRef = useRef<View>(null);
  const itemPositions = useRef<{ [key: string]: number }>({});

  if (!sectionMenu) {
    setSectionMenu(menuItems);
    setAsync("sectionMenu", JSON.stringify(menuItems));
  }

  return (
    <ScrollView
      ref={scrollViewRef}
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
            // TODO: should this also be navigate?
            navigation.popToTop();
            // navigation.navigate("Section", { slug: "all" });
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
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
            // ref={itemRef}
            onLayout={(event) => {
              const xPosition = event.nativeEvent.layout.x;
              itemPositions.current[menuItem.slug] = xPosition;
            }}
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
              if (
                menuItem.title == "Sports" ||
                menuItem.title == "Arts & Culture" ||
                menuItem.title == "Science & Research"
              ) {
                const xPosition = itemPositions.current[menuItem.slug] || 0;
                scrollViewRef.current?.scrollTo({
                  x: xPosition - 10,
                  animated: true,
                });
              }
              navigation.navigate("Section", { slug: menuItem.slug });
              setCurrSection(menuItem.slug);
              // itemRef.current?.measureLayout(
              //   scrollViewRef.current as any,
              //   (x, y, width, height) => {
              //     console.log(x);
              //     scrollViewRef.current?.scrollTo({ x, animated: true });
              //   }
              // );
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
