import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { HomeStackProps } from "src/types/navStacks";
import { MenuItem } from "src/types/other";
import { getAsync } from "src/utils/helpers";
import { menuItems } from "src/utils/setupDevice";
import ArticleScreen from "../article/ArticleScreen";
import SectionsScreen from "../sections/SectionsScreen";
import Staff from "../staff/Staff";
import HomeScreen from "./HomeScreen";
import HorizontalScrollMenu from "./menu/HorizontalScrollMenu";
import SectionPrefScreen from "./menu/SectionPrefScreen";
import { Animated } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, State} from 'react-native-gesture-handler';

const HomeStack = createStackNavigator<HomeStackProps>();

export type MenuContextType = {
  original: MenuItem[];
  sectionMenu: MenuItem[];
  setSectionMenu: Dispatch<SetStateAction<MenuItem[]>>;
  currSection: string;
  setCurrSection: Dispatch<SetStateAction<string>>;
};

export const MenuContext = createContext<MenuContextType>({
  original: [],
  sectionMenu: [],
  setSectionMenu: () => {},
  currSection: "",
  setCurrSection: () => {},
});

function HomeStackScreen({ navigation, route }) {
  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName === "Article") {
      console.log("route is in article");
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    }
    if (routeName === "HomeScreen") {
      navigation.getParent()?.setOptions({ tabBarActiveTintColor: "red" });
      setCurrSection("all");
    }
  }, [navigation, route]);

  const [sectionMenu, setSectionMenu] = useState<MenuItem[]>([]);
  const [currSection, setCurrSection] = useState<string>("all");
  const original = menuItems;

  useEffect(() => {
    const loadSectionsAsync = async () => {
      try {
        const sections = await getAsync("sectionMenu");
        if (sections !== undefined) {
          setSectionMenu(sections);
        } else {
          setSectionMenu(menuItems); // first load
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadSectionsAsync();
  }, []);

  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const swipeThreshold = 100;
      const currentIndex = sectionMenu.findIndex((item) => item.slug === currSection);

      if (event.nativeEvent.translationX > swipeThreshold) {
        setCurrSection(prevSection => {
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            console.log(sectionMenu[prevIndex].slug)
            navigation.navigate("Section", { slug: sectionMenu[prevIndex].slug });

            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              friction: 10,
            }).start();

            console.log("X:")
            console.log(translateX)

            return sectionMenu[prevIndex].slug;
          }
          console.log(prevSection)
          return prevSection;
      });
    } else if (event.nativeEvent.translationX < -swipeThreshold) {
      setCurrSection((prevSection) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < sectionMenu.length) {
          console.log(sectionMenu[nextIndex].slug)
          navigation.navigate("Section", { slug: sectionMenu[nextIndex].slug });

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 10,
          }).start();

          console.log("X")
          console.log(translateX)

          return sectionMenu[nextIndex].slug;
        }
        console.log(prevSection)
        return prevSection;
      });
    }

    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
            >
        <MenuContext.Provider
          value={{
            original,
            sectionMenu,
            setSectionMenu,
            currSection,
            setCurrSection,
          }}
        >
          <HomeStack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              header: HorizontalScrollMenu,
              headerStyle: {
                height: 20,
                position: 'absolute',
              },
            }}
          
          >
            <HomeStack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: true }}
            />
            <HomeStack.Screen
              name="Article"
              component={ArticleScreen}
              options={{
                headerShown: false,
              }}
            />
            <HomeStack.Screen
              name="SectionPref"
              component={SectionPrefScreen}
              options={{
                headerShown: false,
              }}
            />
            <HomeStack.Screen
              name="Section"
              component={SectionsScreen}
              options={{
                headerShown: true,
                gestureEnabled: false,
                animationEnabled: false,
              }}
            />
            <HomeStack.Screen
              name="Staff"
              component={Staff}
              options={{ headerShown: false }}
            />
          </HomeStack.Navigator>
        </MenuContext.Provider>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

export default HomeStackScreen;
