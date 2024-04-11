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

// *** navigation, Home and article ***

export type NavProps = {
  HomePage: undefined;
  Sections: undefined;
  Search: undefined;
  Settings: UserProps;
  Login: UserProps;
};

export type HomeProps = {
  navigation: StackNavigationProp<any, any>;
};

// for home and article
export type ComponentParams = {
  Home: undefined; // No additional parameters for the Home screen
  Article: { articleUrl: string }; // Parameter for the Article screen
};

export type ArticleProps = StackScreenProps<ComponentParams, "Article">;

export type ShareProps = {
  uri: string;
};

// for onboarding nav

export type OnboardParams = {
  Login: {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    community: string;
    setCommunity: Dispatch<SetStateAction<string>>;
  };
  PushNotifs: {
    breaking: boolean;
    setBreaking: Dispatch<SetStateAction<boolean>>;
    weekly: boolean;
    setWeekly: Dispatch<SetStateAction<boolean>>;
    pushToken: string;
    setPushToken: Dispatch<SetStateAction<string>>;
  };
  Done: { setHasOnboarded: Dispatch<SetStateAction<boolean>> };
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
  uuid: string;
  name: string;
  slug: string;
  bio: string;
  tagline: string;
  metadata: string;
  ceo_id: string;
}

export interface Media {
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
  uuid: string;
  name: string;
  slug: string;
  ceo_id: string;
}
