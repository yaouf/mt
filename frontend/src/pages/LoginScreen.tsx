import { View, Text } from "react-native";

/**
 * Page for login
 *   - show only on first load of the app
 *   - user can choose to log in or continue to app without logging in
 *   - login button directs to firebase auth
 *
 * @returns Login screen
 */
function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login!</Text>
    </View>
  );
}

export default LoginScreen;
