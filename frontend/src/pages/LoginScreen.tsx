import { View, Text, StyleSheet, Pressable } from "react-native";
import { LoginProps } from "../types";
import { CustomButton } from "../components/CustomButton";
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
  // const [name, setName] = useState<string>("");
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: "blue",
      padding: 10,
      width: 100,
      height: 30,
      borderRadius: 20,
      borderColor: "red",
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
          <CustomButton
            onPress={handleLogin}
            text="Log In!"
            style={{ backgroundColor: "red" }}
          ></CustomButton>
          {/* <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable> */}
        </>
      )}
    </View>
  );
}

export default LoginScreen;
