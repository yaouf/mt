import { View } from "react-native";
import { varGray1 } from "src/styles/styles";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  color?: string;
};

function Divider({ marginTop, marginBottom, color }: DividerProps) {
  return (
    <View style={{width: "100%", display: "flex", alignItems : "center"}}>
    <View
      style={{
        width: "95%",
        height: 1,
        backgroundColor: color !== undefined ? color : "#ddd",
        marginVertical: 20,
      }}
    />
    </View>
  );
}

export default Divider;
