import { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList } from "react-native";
import Top from "./sections/Top";
import { Article, NavProp } from "src/types/types";
import Divider from "src/components/Divider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "@react-navigation/native";
import SmallHorzGroup from "./sections/SmallHorzGroup";
import AllSmallGroup from "./sections/AllSmallGroup";
import * as SplashScreen from "expo-splash-screen";
import { fetchSectionHome } from "src/code/fetchContent";
import { baseStyles } from "src/styles/styles";

interface Section_Type {
  id: number;
  component: React.ReactNode;
}

SplashScreen.preventAutoHideAsync();

/**
 * Home screen!!
 * TODO: refresh content (look into flatlist refresh prop)
 */
function HomeScreen({ navigation }: NavProp) {
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const [top, setTop] = useState<string[]>([]); // list of top story uuids
  const [topLoaded, setTopLoaded] = useState(false); // splash screen prop
  const [topStories, setTopStories] = useState<Article[]>(); // list of top stories populated once loaded

  // load the top content first so stories in the top are not also shown in each section
  useEffect(() => {
    async function fetchTop() {
      try {
        const data: Article[] = await fetchSectionHome("homepage", 5);
        const top: string[] = data.map((a) => a.uuid);
        setTop(top);
        setTopStories(data);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render once top is fetched
        setTopLoaded(true);
      }
    }
    fetchTop();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (topLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [topLoaded]);

  if (!topLoaded) {
    return null;
  }

  // list of items to use in the flatlist
  const sections: Section_Type[] = [
    {
      id: 1,
      component: <Top topStories={topStories} navigation={navigation} />,
    },
    {
      id: 2,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="opinions"
          count={5}
          title="Opinions"
          top={top}
        />
      ),
    },
    {
      id: 3,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="news"
          count={5}
          title="News"
          top={top}
        />
      ),
    },
    {
      id: 4,
      component: (
        <AllSmallGroup
          navigation={navigation}
          slug="arts-culture"
          count={2}
          title="Arts & Culture"
          top={top}
        />
      ),
    },
    {
      id: 5,
      component: (
        <AllSmallGroup
          navigation={navigation}
          slug="metro"
          count={4}
          title="Metro"
          top={top}
        />
      ),
    },
    {
      id: 6,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="sports"
          count={5}
          title="Sports"
          top={top}
        />
      ),
    },
    {
      id: 7,
      component: (
        <AllSmallGroup
          navigation={navigation}
          slug="science-research"
          count={2}
          title="Science & Research"
          top={top}
        />
      ),
    },
    {
      id: 8,
      component: (
        <AllSmallGroup
          navigation={navigation}
          slug="podcast"
          count={4}
          title="Podcasts"
          top={top}
        />
      ),
    },
  ];

  return (
    <View
      onLayout={onLayoutRootView}
      style={{ ...baseStyles.container, overflow: "visible" }}
    >
      <SafeAreaView style={{ overflow: "visible" }}>
        <FlatList
          ref={flatListRef}
          data={sections}
          renderItem={({ item }) => item.component}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Divider}
          initialNumToRender={1}
          // onRefresh={() => console.log("here")}
        />
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
