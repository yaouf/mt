import { Image } from "react-native";

function Header() {
  return (
    <Image
      source={require("assets/logo-black.png")}
      style={{ width: 207, height: 35 }}
    />
  );
}

export default Header;
