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
        marginTop: small ? 8 : 32,
        marginBottom: 4,
      }}
    />
  );
}

export default Divider;
