import { View } from "react-native";
import { UserProps } from "../types";
import CustomButton from "../components/CustomButton";

function Onboarding(userProps: UserProps) {
  console.log("hereeee in onboarding");

  function handleLogin(community: string) {
    // If Logged In as Brown or Other Community, set as logged in
    if (community != "Guest") {
      userProps.setLoggedIn(true);
      userProps.setUsername("Blueno");
      console.log("Logged into Brown or Other!");
    }
    // If Guest Browsing, set to not logged in
    else {
      userProps.setLoggedIn(false);
      console.log("Browsing as Guest");
    }
    // Setting the community
    userProps.setCommunity(community);

    // set onboarding to true
    userProps.setHasOnboarded(true);
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

export default Onboarding;
