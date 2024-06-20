import { View } from "react-native";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
};

function Divider({ marginTop, marginBottom }: DividerProps) {
  return (
    <View
      style={{
        width: "100%",
        height: 1.3,
        backgroundColor: "#1C1B1F",
        marginTop: marginTop !== undefined ? marginTop : 32,
        marginBottom: marginBottom !== undefined ? marginBottom : 4,
      }}
    />
  );
}

export default Divider;
