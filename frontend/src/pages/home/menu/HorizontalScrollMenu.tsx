import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import Draggable from "./SectionPref";
import { font2 } from "src/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/types";

interface MenuItem {
  id: number;
  title: string;
  slug: string;
}

// interface HorizontalScrollMenuProps {
//   sections: string[];
//   // onItemClick: (s: string) => void; // Function to handle item clicks
// }

const menuItems: MenuItem[] = [
  { id: 1, title: "FILTER", slug: "filter" },
  { id: 2, title: "all", slug: "home" }, // no slug but go home
  { id: 3, title: "opinions", slug: "opinions" }, // no slug but go home
  { id: 4, title: "university news", slug: "university-news" },
  { id: 5, title: "arts & culture", slug: "arts-culture" },
  { id: 6, title: "metro", slug: "metro" },
  { id: 7, title: "sports", slug: "sports" },
  { id: 8, title: "science & research", slug: "science-research" },
  { id: 9, title: "podcast", slug: "podcast" },
  // TODO: are we including post, multimedia, special projects ... and what order
];

function HorizontalScrollMenu({ navigation }: NavProp) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState(menuItems);

  const onItemClick = (item: MenuItem) => {
    navigation.push("Section", { slug: item.slug });
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.id === 1) {
      setIsDrawerOpen(true);
      console.log(isDrawerOpen);
    } else if (item.id === 2) {
      navigation.popToTop();
    } else {
      onItemClick(item); // Call the prop function with the clicked item index
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {menuItems.map((menuItem) => (
          <TouchableOpacity
            key={menuItem.id}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(menuItem)}
          >
            {menuItem.id === 1 ? ( // if filter, render filter icon instead of text
              <Ionicons name="filter-outline" size={24} color="black" />
            ) : (
              <Text style={styles.menuItemText}>{menuItem.title}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isDrawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsDrawerOpen(false)}
          >
            <Text>Done</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>FAVORITE SECTIONS</Text>
          <Text style={styles.subheading}>
            Add and reorder topics to customize the menu on your Top Stories
            page.
          </Text>
          <Draggable />
          <Text style={styles.heading}>REMOVED SECTIONS</Text>
        </View>
      )}
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    top: 0,
    zIndex: 1,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 0,
    marginHorizontal: 0,
  },
  menuItemText: {
    fontSize: 16,
    textTransform: "uppercase",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: "#F3F3F3",
    zIndex: 999,
    padding: 20,
  },
  heading: {
    fontFamily: font2,
    fontSize: 16,
    marginBottom: 16,
    marginTop: 12,
    fontStyle: "normal",
    fontWeight: "800",
  },
  subheading: {
    fontFamily: font2,
    fontSize: 16,
    marginBottom: 20,
    fontStyle: "normal",
    fontWeight: "500",
  },
  button: {
    fontFamily: font2,
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    fontStyle: "normal",
    fontWeight: "500",
    textTransform: "capitalize",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
  },
});

export default HorizontalScrollMenu;
