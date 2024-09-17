import { StackScreenProps } from "@react-navigation/stack";
import { useContext } from "react";
import { Text, TouchableOpacity, View, SafeAreaView, Dimensions, StyleSheet } from "react-native";
import Notif from "src/components/Notif";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { settings } from "src/styles/pages";
import { text } from "src/styles/styles";
import { OnboardParams } from "src/types/navStacks";
import { font2 } from "src/styles/styles";
import { setUpDevice } from "../code/setup";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

function PushNotifsScreen({
  route,
  navigation,
}: StackScreenProps<OnboardParams, "PushNotifs">) {
  const {
    breaking,
    setBreaking,
    universityNews,
    setUniversityNews,
    metro,
    setMetro,
    setDeviceID,
    systemPermissionStatus,
    requestPermission,
  } = useContext(NotificationContext);

  const saveNotifPreferences = async () => {
    requestPermission().then((status) => {
      setUpDevice(
        setBreaking,
        setUniversityNews,
        setMetro,
        status,
        breaking,
        universityNews,
        metro
      ).then((id) => setDeviceID(id));
    });

    route.params.parentNav.push("MainApp");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
              <Text style={text.bigTitle}>Welcome.</Text>
              <Text style={text.normal}>
              Turn on alerts for the topics that interest you and we'll keep you
              updated.
              </Text>
          
            <View style={styles.notifContainer}>
              <Notif
                title="Breaking News"
                description="Urgent and developing coverage"
                value={breaking}
                setValue={setBreaking}
                onboarding={true}
              />
              <Notif
                title="University News"
                description="The latest on Brown and the campus community"
                value={universityNews}
                setValue={setUniversityNews}
                onboarding={true}
              />
              <Notif
                title="Metro"
                description="Updates from Providence and beyond"
                value={metro}
                setValue={setMetro}
                onboarding={true}
              />
            </View>
        </View> 
        <View style={{width: "100%"}}>
            <TouchableOpacity
              style={settings.continueButton}
              onPress={saveNotifPreferences}
            >
              <Text style={{fontFamily: font2}}>Save and continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[settings.continueButton, styles.maybeLaterButton]}
              onPress={() => {
                setUpDevice(setBreaking, setUniversityNews, setMetro, systemPermissionStatus)
                  .then((id) => setDeviceID(id))
                  .then(() => route.params.parentNav.push("MainApp"));
              }}
            >
              <Text style={text.normal}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 0.05*screenHeight, 
  },
  notifContainer: {
    marginTop: 20, // Add some margin to push the content down
    rowGap: 16,
    width: screenWidth*0.8, // The switches oveflow from their container so they need custom width 
  },
  maybeLaterButton: {
    borderColor: "white",
    marginTop: 0, // Adjust spacing if needed
  },
});

export default PushNotifsScreen;
