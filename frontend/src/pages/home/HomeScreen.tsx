import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import Top from "./sections/Top";
import { NavProp } from "src/types/navStacks";
import { Article } from "src/types/data";
import Divider from "src/components/Divider";
import { useScrollToTop } from "@react-navigation/native";
import SmallHorzGroup from "./sections/SmallHorzGroup";
import AllSmallGroup from "./sections/AllSmallGroup";
import * as SplashScreen from "expo-splash-screen";
import { fetchSectionHome } from "src/code/fetchContent";

interface Section_Type {
  id: number;
  component: React.ReactNode;
}

SplashScreen.preventAutoHideAsync();

function HomeScreen({ navigation }: NavProp) {
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const [top, setTop] = useState<string[]>([]);
  const [topLoaded, setTopLoaded] = useState(false);
  const [topStories, setTopStories] = useState<Article[]>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchTop = async () => {
    try {
      const data: Article[] = await fetchSectionHome("homepage", 5);
      const top: string[] = data.map((a) => a.uuid);
      setTop(top);
      setTopStories(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setTopLoaded(true);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTop();  // Re-run the fetchTop function to reload top stories
    setRefreshing(false);
  };

  const onLayoutRootView = useCallback(async () => {
    if (topLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [topLoaded]);

  if (!topLoaded) {
    return null;
  }

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
          slug="university-news"
          count={5}
          title="University News"
          top={top}
        />
      ),
    },
    {
      id: 3,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="metro"
          count={4}
          title="Metro"
          top={top}
        />
      ),
    },

    {
      id: 4,
      component: (
        <AllSmallGroup
          navigation={navigation}
          slug="opinions"
          count={3}
          title="Opinions"
          top={top}
        />
      ),
    },
    {
      id: 5,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="arts-culture"
          count={4}
          title="Arts & Culture"
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
          count={4}
          title="Sports"
          top={top}
        />
      ),
    },
    {
      id: 7,
      component: (
        <SmallHorzGroup
          navigation={navigation}
          slug="science-research"
          count={4}
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
          slug="podcasts"
          count={4}
          title="Podcasts"
          top={top}
        />
      ),
    },
  ];

  return (
    <View onLayout={onLayoutRootView}>
      <FlatList
        ref={flatListRef}
        data={sections}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: 16 }}>
          </View>
        )}
        initialNumToRender={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

export default HomeScreen;
