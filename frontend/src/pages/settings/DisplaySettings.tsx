import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fyp } from "src/styles/pages";
import { settings } from "src/styles/pages";
import { NavProp, SearchStackProps } from "src/types/navStacks";
import { text, varTextColor, baseStyles, darkStyles, darkModeText } from "src/styles/styles";
import { useTheme } from "src/components/ThemeContext";

//Screen for display settings

function DisplaySettings({navigation} : NavProp) {
  const { isDarkMode, toggleTheme } = useTheme();
  const toggleValue = false;

  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  const textStyle = isDarkMode ? darkModeText : text;

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <ScrollView style={containerStyle.container}>
        <Text style={textStyle.sectionHeader1}>Display Settings</Text>
        <View style={{ rowGap: 16, marginTop: 4 }}>
        <Text style={settings.smallHeading }>Appearance</Text>
        <View style={fyp.toggleRow}>
              <View style={{ flex: 1, paddingRight: 64 }}>
                <Text style={textStyle.sectionHeader3}>Automatic</Text>
              </View>
              <Switch
                trackColor={{ true: "#000000", false: "grey" }}
                value={isDarkMode}
                onValueChange={toggleTheme}
                accessibilityLabel={`Automatic display setting`}
                accessibilityHint={`Toggle to enable or disable automatic display mode`}
                accessibilityRole="switch"
                accessibilityState={{ checked: toggleValue }}
              />
            </View>
            </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    paddingTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  backButton: {
    marginTop: 15,
    marginLeft: 15,
  },
});

export default DisplaySettings;
