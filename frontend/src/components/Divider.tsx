import { View } from "react-native";
import { darkStyles, baseStyles } from "src/styles/styles";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  color?: string;
  isDarkMode?: boolean;
};

function Divider({ marginTop, marginBottom, color, isDarkMode }: DividerProps) {
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
