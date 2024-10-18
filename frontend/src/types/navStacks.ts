import { StackNavigationProp } from "@react-navigation/stack";
import { Article } from "./data";

/**
 * format is the name of the screens used in that stack
 * and parameters for each screen
 */

export type HomeStackProps = {
  HomeScreen: undefined; // No additional parameters for the Home screen
  Article: { data: Article }; // Parameter for the Article screen
  Section: { slug: string };
  Staff: { slug: string };
  SectionPref: {};
};

export type SearchStackProps = {
  SearchScreen: undefined;
  FilterScreen: { searchType: string };
  Article: { data: Article };
};

export type SettingsStackProps = {
  SettingsScreen: undefined;
  Article: { data: Article };
  Staff: { slug: string };
  SavedArticles: undefined;
  DevTeam: undefined;
};

export type OnboardParams = {
  WelcomeScreen: undefined;
  PushNotifs: { parentNav: StackNavigationProp<any, any> };
};

/**
 * other nav props
 * */

// used in anything that needs a navigation prop
export type NavProp = {
  navigation: StackNavigationProp<any, any>;
};

// for article cards
export type CardProps = {
  article: Article;
  navigation: StackNavigationProp<any, any>;
};

// for sections (like on home page)
export type SectionGroupProps = {
  navigation: StackNavigationProp<any, any>;
  slug: string;
  count: number;
  title: string;
  top: string[];
};
