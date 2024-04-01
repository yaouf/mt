import { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type LoginProps = {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

/**
 * Page for login
 *   - show only on first load of the app
 *   - user can choose to log in or continue to app without logging in
 *   - login button directs to firebase auth
 *
 * @returns Login screen
 */
function LoginScreen({
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
}: LoginProps) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#808080",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  function handleLogin() {
    setLoggedIn(true);
    setUsername("X"); //??
    console.log("Logged in.");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loggedIn ? (
        <>
          <Text>{username}</Text>
        </>
      ) : (
        <>
          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default LoginScreen;
