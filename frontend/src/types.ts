import { Dispatch, SetStateAction } from "react";
import { StackNavigationProp } from "@react-navigation/stack";

// props for login and settings page
export type LoginProps = {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

export type NavProps = {
  HomePage: undefined;
  Sections: undefined;
  Search: undefined;
  Settings: LoginProps;
  Login: LoginProps;
};

export type HomeProps = {
  navigation: StackNavigationProp<any, any>;
};

// for home and article
export type ComponentParams = {
  Home: undefined; // No additional parameters for the Home screen
  Article: { articleUrl: string }; // Parameter for the Article screen
};
