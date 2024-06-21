import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import { HomeStackProps, MenuItem } from "src/types/types";
import ArticleScreen from "../article/ArticleScreen";
import SectionsScreen from "../sections/SectionsScreen";
import HorizontalScrollMenu from "./menu/HorizontalScrollMenu";
import Staff from "../staff/Staff";
import SectionPrefScreen from "./menu/SectionPrefScreen";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { getAsync } from "src/code/helpers";
import { menuItems } from "src/code/setup";

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

function HomeStackScreen() {
  const [sectionMenu, setSectionMenu] = useState<MenuItem[]>([]);
  const [currSection, setCurrSection] = useState<string>("all");
  const original = menuItems;

  useEffect(() => {
    const loadSectionsAsync = async () => {
      try {
        const sections = await getAsync("sectionMenu");
        setSectionMenu(sections);
      } catch (err) {
        console.log(err);
      }
    };
    loadSectionsAsync();
  }, []);

  return (
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
          // headerStyle: {
          //   height: 20,
          // },
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
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="Section"
          component={SectionsScreen}
          options={{ headerShown: true }}
        />
        <HomeStack.Screen
          name="Staff"
          component={Staff}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="SectionPref"
          component={SectionPrefScreen}
          options={{ headerShown: false }}
        />
      </HomeStack.Navigator>
    </MenuContext.Provider>
  );
}

export default HomeStackScreen;
