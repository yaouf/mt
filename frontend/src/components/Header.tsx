import { Dimensions, Image, View } from "react-native";
import { useTheme } from "./ThemeContext";
import { baseStyles, darkStyles } from "src/styles/styles";

function Header() {
  const screenWidth = Dimensions.get("window").width;
  const { isDarkMode, toggleTheme } = useTheme();
  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        backgroundColor: containerStyle.container.backgroundColor
      }}
    >
      <View style={{ width: screenWidth * 0.9,
        backgroundColor: containerStyle.container.backgroundColor
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
