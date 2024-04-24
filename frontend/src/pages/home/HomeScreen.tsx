import { useRef } from "react";
import { View, FlatList, ScrollView } from "react-native";
import HorizontalScrollMenu from "./menu/HorizontalScrollMenu";
import News from "./sections/News";
import Sports from "./sections/Sports";
import Opinions from "./sections/Opinions";
import ArtsCulture from "./sections/ArtsCulture";
import ScienceResearch from "./sections/ScienceResearch";
import Metro from "./sections/Metro";
import Podcast from "./sections/Podcast";
import Top from "./sections/Top";
import { NavProp } from "src/types/types";

interface MenuItem {
  id: number;
  title: string;
}

interface Section_Type {
  id: number;
  title: string;
  component: React.ReactNode;
}

/**
 * Home screen!!
 */
function HomeScreen({ navigation }: NavProp) {
  const flatListRef = useRef<FlatList>(null);

  const sections: Section_Type[] = [
    { id: 1, title: "Top", component: <Top navigation={navigation} /> },
    {
      id: 2,
      title: "Opinions",
      component: <Opinions navigation={navigation} />,
    },
    { id: 3, title: "News", component: <News navigation={navigation} /> },
    {
      id: 4,
      title: "Arts & Culture",
      component: <ArtsCulture navigation={navigation} />,
    },
    { id: 5, title: "Metro", component: <Metro navigation={navigation} /> },
    { id: 6, title: "Sports", component: <Sports navigation={navigation} /> },
    {
      id: 7,
      title: "Science & Research",
      component: <ScienceResearch navigation={navigation} />,
    },
    {
      id: 8,
      title: "Podcasts",
      component: <Podcast navigation={navigation} />,
    },
  ];

  // scroll to section top
  const handleMenuClick = (item: MenuItem) => {
    // Logic to scroll to the corresponding section based on the index
    const index = sections.findIndex((section) => section.id === item.id) - 1;
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View>
      <HorizontalScrollMenu onItemClick={handleMenuClick} />
      <View style={{ marginLeft: 16, marginRight: 16 }}>
        <FlatList
          ref={flatListRef}
          data={sections}
          renderItem={({ item }) => item.component}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
        />
      </View>
    </View>
  );
}

export default HomeScreen;
