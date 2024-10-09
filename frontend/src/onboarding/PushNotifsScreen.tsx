import { StackScreenProps } from "@react-navigation/stack";
import { useContext } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Notif from "src/components/Notif";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { settings } from "src/styles/pages";
import { font2, text } from "src/styles/styles";
import { OnboardParams } from "src/types/navStacks";
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
    sports,
    setSports,
    artsAndCulture,
    setArtsAndCulture,
    scienceAndResearch,
    setScienceAndResearch,
    opinions,
    setOpinions,
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

  console.log("sports", sports, artsAndCulture, scienceAndResearch, opinions);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.title}>Welcome.</Text>
            <Text style={styles.description}>
              Turn on alerts for the topics that interest you and we'll keep you
              updated.
            </Text>

            <View style={styles.notifContainer}>
              {/* TODO: factor out duplicate descriptions between this and settingsscreen */}
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
              <Notif
                title="Sports"
                description="Game coverage and exclusives"
                value={sports}
                setValue={setSports}
                onboarding={true}
              />
              <Notif
                title="Arts and Culture"
                description="Events and reviews from our critics"
                value={artsAndCulture}
                setValue={setArtsAndCulture}
                onboarding={true}
              />
              <Notif
                title="Science and Research"
                description="The cutting edge of research"
                value={scienceAndResearch}
                setValue={setScienceAndResearch}
                onboarding={true}
              />
              <Notif
                title="Opinions"
                description="Columns, op-eds and editorials"
                value={opinions}
                setValue={setOpinions}
                onboarding={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={saveNotifPreferences}
          accessible={true}
          accessibilityRole="button"
          accessibilityHint="Press to save notification preferences and continue to the app"
        >
          <Text style={styles.buttonText}>Save and continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, styles.maybeLaterButton]}
          onPress={() => {
            setUpDevice(
              setBreaking,
              setUniversityNews,
              setMetro,
              systemPermissionStatus
            )
              .then((id) => setDeviceID(id))
              .then(() => route.params.parentNav.push("MainApp"));
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityHint="Press to skip setting up notifications"
        >
          <Text style={styles.buttonText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: "5%",
  },
  title: {
    ...text.bigTitle,
    fontSize: 32,
    marginBottom: "5%",
  },
  description: {
    ...text.normal,
    fontSize: 16,
    marginBottom: "5%",
  },
  notifContainer: {
    rowGap: 16,
    width: "100%",
  },
  buttonContainer: {
    padding: "5%",
  },
  continueButton: {
    ...settings.continueButton,
    marginBottom: "2%",
  },
  maybeLaterButton: {
    borderColor: "white",
  },
  buttonText: {
    fontFamily: font2,
    fontSize: 16,
  },
});

export default PushNotifsScreen;
