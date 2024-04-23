import { useRef } from "react";
import { View, FlatList } from "react-native";
import { baseStyles } from "../../styles/styles";
import HorizontalScrollMenu from "./HorizontalScrollMenu";
import All from "./sections/All";
import News from "./sections/News";
import Sports from "./sections/Sports";

interface MenuItem {
  id: number;
  title: string;
}

interface Section_Type {
  id: number;
  title: string;
  component: React.ReactNode;
}

const sections: Section_Type[] = [
  { id: 1, title: "All", component: <All /> },
  { id: 2, title: "News", component: <News /> },
  { id: 3, title: "Sports", component: <Sports /> },
  // Add more sections here
];

/**
 * Home screen!!
 */
function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);

  // scroll to section top
  const handleMenuClick = (item: MenuItem) => {
    // Logic to scroll to the corresponding section based on the index
    const index = sections.findIndex((section) => section.id === item.id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View style={baseStyles.container}>
      <HorizontalScrollMenu onItemClick={handleMenuClick} />

      <FlatList
        ref={flatListRef}
        data={sections}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
      />
    </View>
  );
}

export default HomeScreen;
