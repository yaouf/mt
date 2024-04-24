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

interface MenuItem {
  id: number;
  title: string;
}

interface HorizontalScrollMenuProps {
  onItemClick: (item: MenuItem) => void; // Function to handle item clicks
}

const menuItems: MenuItem[] = [
  { id: 1, title: "FILTER" },
  { id: 2, title: "ALL" },
  { id: 3, title: "OPINIONS" },
  { id: 4, title: "NEWS" },
  { id: 5, title: "ARTS & CULTURE" },
  { id: 6, title: "METRO" },
  { id: 7, title: "SPORTS" },
  { id: 8, title: "SCIENCE & RESEARCH" },
  { id: 9, title: "PODCASTS" },
];

function HorizontalScrollMenu({ onItemClick }: HorizontalScrollMenuProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState(menuItems);

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
            <Text style={styles.menuItemText}>{menuItem.title}</Text>
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
    fontSize: 14,
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
    marginBottom: 20,
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
