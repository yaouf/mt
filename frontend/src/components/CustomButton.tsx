import { Text, ViewStyle, TouchableOpacity, StyleSheet } from "react-native";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  buttonColor?: string; // Optional
  textColor?: string; // Optional
  style?: ViewStyle; // Allows for custom styles when we pass in our own styles
}

// Custom Button Component
export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  style = {},
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.button, style]} // This array merges default style with custom style
  >
    <Text style={[styles.buttonText, style]}>{text}</Text>
  </TouchableOpacity>
);

// Default Styling for Custom Button - when user does not pass in their own styles
const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 70,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "brown",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomButton;
