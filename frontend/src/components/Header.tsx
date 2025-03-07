import { Dimensions, Image, View } from "react-native";
import { useTheme } from "./ThemeContext";

function Header() {
  const screenWidth = Dimensions.get("window").width;
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        // backgroundColor: "black"
      }}
    >
      <View style={{ width: screenWidth * 0.9,
        // backgroundColor: "black"
       }}>
        <Image
          source={require("assets/logo-black.png")}
          style={{
            width: 207,
            height: 35,
            alignSelf: "center",
          }}
        />
      </View>
    </View>
  );
}

export default Header;
