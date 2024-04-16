import { NativeBaseProvider } from "native-base";
import BdhApp from "./src/BdhApp";

export default function App() {
  return (
    <NativeBaseProvider>
      <BdhApp />
    </NativeBaseProvider>
  );
}
