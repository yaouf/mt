import { Dispatch, SetStateAction } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

// props for login and settings page
export type UserProps = {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  community: string;
  setCommunity: Dispatch<SetStateAction<string>>;
  setHasOnboarded: Dispatch<SetStateAction<boolean>>;
  breaking: boolean;
  setBreaking: Dispatch<SetStateAction<boolean>>;
  weekly: boolean;
  setWeekly: Dispatch<SetStateAction<boolean>>;
  pushToken: string;
  setPushToken: Dispatch<SetStateAction<string>>;
};

export type ShareProps = {
  uri: string;
};

// for onboarding nav

export type OnboardParams = {
  Login: undefined;
  PushNotifs: undefined;
  Done: { setHasOnboarded: Dispatch<SetStateAction<boolean>> };
};

export type OnboardProps = {
  setHasOnboarded: Dispatch<SetStateAction<boolean>>;
};

export type LoginProps = StackScreenProps<OnboardParams, "Login">;
export type PushNotifProps = StackScreenProps<OnboardParams, "PushNotifs">;
export type DoneProps = StackScreenProps<OnboardParams, "Done">;

export type SearchProps = {
  scrollPositionText: number;
  screenHeight: number;
  scrollPositionButton: number;
};

/**
 * For cards and articles and media
 */

export interface Article {
  article: {
    id: string;
    headline: string;
    subhead: string;
    uuid: string;
    slug: string;
    content: string;
    published_at: string;
    tags: Tag[];
    authors: Author[];
    dominantMedia: Media;
  };
}

export interface Author {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  bio: string;
  tagline: string;
  metadata: string;
  ceo_id: string;
}

export interface Media {
  id: string;
  uuid: string;
  attachment_uuid: string;
  base_name: string;
  extension: string;
  title: string;
  content: string;
  type: string;
  published_at: string;
  ceo_id: string;
  authors: Author[];
}

export interface Tag {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  ceo_id: string;
}

/**
 * for navigation stacks
 */

// used in HomeStackScreen
export type HomeStackProps = {
  HomeScreen: undefined; // No additional parameters for the Home screen
  Article: { data: Article }; // Parameter for the Article screen
};

// used in ArticleScreen
export type ArticleProps = StackScreenProps<HomeStackProps, "Article">;

// used in HomeScreen and all the section screens
export type NavProp = {
  navigation: StackNavigationProp<any, any>;
};

// for article cards
export type CardProps = {
  article: Article;
  navigation: StackNavigationProp<any, any>;
};
