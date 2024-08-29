import { View } from "react-native";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  color?: string;
};

function Divider({ marginTop, marginBottom, color }: DividerProps) {
  return (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: color !== undefined ? color : "#1C1B1F",
        marginTop: marginTop !== undefined ? marginTop : 32,
        marginBottom: marginBottom !== undefined ? marginBottom : 4,
      }}
    />
  );
}

export default Divider;
