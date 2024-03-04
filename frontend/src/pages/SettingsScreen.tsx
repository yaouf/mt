import { Dispatch, SetStateAction, useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";

type LoginProps = {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

/**
 * Page for settings
 *   - show login button if not already logged in
 *   - if logged in, show name/email
 *   - option to allow push notifications (send id to backend)
 *   - toggle to choose different types of notifications
 *   - option to delete account
 *   - contact us / feedback ?
 *
 * @returns Settings screen
 */
function Settings({
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
}: LoginProps) {
  // const [name, setName] = useState<string>("");
  const [pushNotifs, setPushNotifs] = useState<boolean>(false);
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);

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

  function handleDelete() {
    console.log("Account deleted.");
  }

  function handlePushNotifs() {
    setPushNotifs((previousState) => !previousState);
  }

  function handleContact() {
    console.log("Contact!");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loggedIn ? (
        <>
          <Text>{username}</Text>
          <Pressable onPress={handleDelete} style={styles.button}>
            <Text style={styles.buttonText}>Delete account</Text>
          </Pressable>
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Pressable onPress={handleContact} style={styles.button}>
            <Text style={styles.buttonText}>Contact us</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Pressable onPress={handleContact}>
            <Text>Contact us</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default Settings;
