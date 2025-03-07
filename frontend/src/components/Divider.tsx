import { View } from "react-native";
import { darkStyles, baseStyles } from "src/styles/styles";
import { useTheme } from "./ThemeContext";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  color?: string;
};

function Divider({ marginTop, marginBottom, color}: DividerProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const bgColor = isDarkMode ? darkStyles.container.backgroundColor : baseStyles.container.backgroundColor;
  return (
    <View style={{width: "100%", display: "flex", alignItems : "center", backgroundColor: bgColor}}>
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: color !== undefined ? color : "#ddd",
        marginVertical: 20,
      }}
    />
    </View>
  );
}

export default Divider;
