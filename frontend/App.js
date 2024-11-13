// import { NativeBaseProvider } from "native-base";
import Aptabase from "@aptabase/react-native";
import "expo-dev-client";
import BdhApp from "./src/BdhApp";
import { NotificationProvider } from "./src/pages/settings/NotificationProvider";
// import at the top
// import "react-native-gesture-handler";

// wrap whole app with <GestureHandlerRootView>
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// Analytics must get initialized before App entry point
Aptabase.init("A-US-0216379455");

export default function App() {
  return (
    <NotificationProvider>
      <BdhApp />
    </NotificationProvider>
  );
}
