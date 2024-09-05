// import { NativeBaseProvider } from "native-base";
import BdhApp from "./src/BdhApp";
import Aptabase from "@aptabase/react-native";
// import at the top
// import "react-native-gesture-handler";

// wrap whole app with <GestureHandlerRootView>
// import { GestureHandlerRootView } from "react-native-gesture-handler";


// Analytics must get initialized before App entry point
Aptabase.init("A-US-0216379455");

export default function App() {
  return <BdhApp />;
}
