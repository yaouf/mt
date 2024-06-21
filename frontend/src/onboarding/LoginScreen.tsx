// import { Text } from "react-native";
// import CustomButton from "../components/CustomButton";
// import { setAsync } from "../code/helpers";
// import { LoginProps } from "src/types/types";

// TODO: login and auth in future version


// function LoginScreen(props: LoginProps) {
//   console.log("onboarding - login");

// function handleLogin(community: string) {
//   // If Logged In as Brown or Other Community, set as logged in
//   if (community != "Guest") {
//     setAsync("loggedIn", "true");
//     setAsync("username", "Blueno");
//     console.log("Logged into Brown or Other!");
//   }
//   // If Guest Browsing, set to not logged in
//   else {
//     console.log("Browsing as Guest");
//     setAsync("loggedIn", "false");
//   }
//   // Setting the community
//   setAsync("community", community);

//   // then continue to push notifs
//   props.navigation.push("PushNotifs");
// }

// return (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <CustomButton
//       text={"Login to Brown Community"}
//       onPress={() => handleLogin("Brown")}
//     />
//     <CustomButton
//       text={"Login to Other Community"}
//       onPress={() => handleLogin("Other")}
//     />
//     <CustomButton
//       text={"I don't want to Login!"}
//       onPress={() => handleLogin("Guest")}
//     />
//   </View>
// );
// }

// export default LoginScreen;
