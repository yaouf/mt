import { useState } from "react";
import { View, Text, Button, Switch } from "react-native";

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
function Settings() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [pushNotifs, setPushNotifs] = useState<boolean>(false);

  function handleLogin() {
    setLoggedIn(true);
    setName("X"); //??
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
          <Text>{name}</Text>
          <Button title="Delete account" onPress={handleDelete} />
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Button title="Contact us" onPress={handleContact} />
        </>
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <Text>Push Notifications</Text>
          <Switch value={pushNotifs} onValueChange={handlePushNotifs} />
          <Button title="Contact us" onPress={handleContact} />
        </>
      )}
    </View>
  );
}

export default Settings;
