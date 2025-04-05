import { View } from "react-native";
import Search from "./Search";
import { NavProp } from "src/types/navStacks";
import { baseStyles, darkStyles, text, darkModeText } from "../../styles/styles";
import { useTheme } from "src/components/ThemeContext";

function SearchScreen({ navigation }: NavProp) {

  const { isDarkMode, toggleTheme } = useTheme();

  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  const textStyle = isDarkMode ? darkModeText : text;
  return (
    <View 
      style={[containerStyle.container, {flex: 1} ]}
    >
      <Search navigation={navigation} />
    </View>
  );
}

export default SearchScreen;
