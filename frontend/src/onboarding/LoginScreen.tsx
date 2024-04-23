import { View } from "react-native";
import { LoginProps } from "../types/types";
import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";

function LoginScreen(props: LoginProps) {
  console.log("onboarding - login");
  const userProps = props.route.params;

  function handleLogin(community: string) {
    // If Logged In as Brown or Other Community, set as logged in
    if (community != "Guest") {
      userProps.setLoggedIn(true);
      userProps.setUsername("Blueno");

      setAsync("loggedIn", "true");
      setAsync("username", "Blueno");

      console.log("Logged into Brown or Other!");
    }
    // If Guest Browsing, set to not logged in
    else {
      userProps.setLoggedIn(false);
      console.log("Browsing as Guest");
      setAsync("loggedIn", "false");
    }
    // Setting the community
    userProps.setCommunity(community);
    setAsync("community", community);

    // then continue to push notifs
    props.navigation.navigate("PushNotifs");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomButton
        text={"Login to Brown Community"}
        onPress={() => handleLogin("Brown")}
      />
      <CustomButton
        text={"Login to Other Community"}
        onPress={() => handleLogin("Other")}
      />
      <CustomButton
        text={"I don't want to Login!"}
        onPress={() => handleLogin("Guest")}
      />
    </View>
  );
}

export default LoginScreen;
