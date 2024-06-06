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
  { id: 2, title: "ALL", slug: "home" }, // no slug but go home
  { id: 3, title: "NEWS", slug: "news" },
  { id: 4, title: "SPORTS", slug: "sports" },
  { id: 5, title: "ARTS & CULTURE", slug: "arts-culture" },
  { id: 6, title: "SCIENCE & RESEARCH", slug: "science-research" },
  { id: 7, title: "OPINIONS", slug: "opinions" },
  { id: 8, title: "PROJECTS", slug: "projects" },
  { id: 9, title: "POST-MAGAZINE", slug: "post-magazine" }, // might need to exlude for now
  { id: 10, title: "MULTIMEDIA", slug: "multimedia" }, // do we want a podcast page or just podcasts under multimedia
];

function HorizontalScrollMenu({ navigation }: NavProp) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState(menuItems);

  const onItemClick = (item: MenuItem) => {
    navigation.push("Section", { slug: item.slug });
    console.log("open page for", item);
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.id === 1) {
      setIsDrawerOpen(true);
      console.log(isDrawerOpen);
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
    backgroundColor: "white",
    marginHorizontal: 0,
  },
  menuItemText: {
    fontSize: 16,
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
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default HorizontalScrollMenu;
