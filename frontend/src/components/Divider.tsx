import { View } from "react-native";

type DividerProps = {
  small?: boolean;
};

function Divider({ small }: DividerProps) {
  return (
    <View
      style={{
        width: "100%",
        height: 1.3,
        backgroundColor: "#1C1B1F",
        marginTop: small ? 8 : 28,
        marginBottom: 8,
      }}
    />
  );
}

export default Divider;
