import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { UserProps } from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { removeAsync, setAsync } from "../../code/helpers";
import { notifToggle } from "../../styles/styles";

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
function SettingsScreen(userProps: UserProps) {
  /**
   * login in user and update async storage
   */
  function handleLogin() {
    userProps.setLoggedIn(true);
    const username = "X"; //TODO: get username from auth
    userProps.setUsername(username);

    setAsync("loggedIn", "true");
    setAsync("username", username);

    console.log("Logged in.");
  }

  /**
   * logout user and clear async storage
   */
  async function handleLogout() {
    userProps.setLoggedIn(false);
    userProps.setUsername("");
    userProps.setCommunity("");

    setAsync("loggedIn", "false");
    removeAsync("username");
    removeAsync("community");

    console.log("Logged Out");
  }

  /**
   * delete account
   * clear async storage
   */
  async function deleteUser() {
    // call backend to delete, logout for now
    handleLogout();
    console.log("deleted account");
  }

  // function handlePushNotifs() {
  //   setPushNotifs((previousState) => !previousState);
  // }

  /**
   * update settings in async storage, call backend update
   */
  const updateSettings = () => {
    setAsync("breakingNotifs", JSON.stringify(userProps.breaking));
    setAsync("weeklyNotifs", JSON.stringify(userProps.weekly));

    // TODO: do i need to request push token again?
    // is there a way to know if the backend already has it?
    // or just do this everytime a setting is changed - update settings doesn't take a push token though
    console.log("update settings!!");
  };

  function handleContact() {
    console.log("Contact!");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {userProps.loggedIn ? (
        <>
          <Text>{userProps.username}</Text>
          <CustomButton text={"Logout"} onPress={handleLogout} />
          <CustomButton text={"Delete account"} onPress={deleteUser} />
        </>
      ) : (
        <CustomButton text={"Login"} onPress={handleLogin} />
      )}
      <View style={{ margin: 30 }}>
        <Text>Push Notifications</Text>
        <View style={notifToggle.toggleRow}>
          <Text>Breaking News Alerts</Text>
          <Switch
            value={userProps.breaking}
            onValueChange={() =>
              userProps.setBreaking((previousState: boolean) => !previousState)
            }
          />
        </View>
        <View style={notifToggle.toggleRow}>
          <Text>Weekly Summary </Text>
          <Switch
            value={userProps.weekly}
            onValueChange={() =>
              userProps.setWeekly((previousState: boolean) => !previousState)
            }
          />
        </View>
        <CustomButton text={"Save changes"} onPress={updateSettings} />
      </View>
      <CustomButton text={"Contact us"} onPress={handleContact} />
    </View>
  );
}

export default SettingsScreen;
