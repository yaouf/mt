import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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
  const arrowColor = isDarkMode ? "white" : "black";



  return (
    <SafeAreaView style={[{ flex: 1 }, containerStyle.container]}>
      <TouchableOpacity
        style={{marginTop: 15,
          marginLeft: 15,
          backgroundColor: containerStyle.container.backgroundColor}}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={arrowColor} />
      </TouchableOpacity>
      <ScrollView style={containerStyle.container}>
        <Text style={textStyle.sectionHeader1}>Display Settings</Text>
        <View style={{ rowGap: 16, marginTop: 4 }}>
        <Text style={settings.smallHeading }>Appearance</Text>
        <View style={fyp.toggleRow}>
              <View style={{ flex: 1, paddingRight: 64 }}>
                <Text style={textStyle.sectionHeader3}>Dark Mode</Text>
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
    </SafeAreaView>
  );
}

export default DisplaySettings;
