import { Dimensions, Image, View } from "react-native";

function Header() {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
      }}
    >
      <View style={{ width: screenWidth * 0.9 }}>
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
