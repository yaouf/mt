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
