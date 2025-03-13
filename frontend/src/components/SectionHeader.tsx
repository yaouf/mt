import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MenuContext } from "src/pages/home/HomeStackScreen";
import { darkModeText, text } from "src/styles/styles";
import { useTheme } from "./ThemeContext";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
});

type SectionHeaderProps = {
  navigation: StackNavigationProp<any, any>;
  slug: string;
  title: string;
};

function SectionHeader(props: SectionHeaderProps) {
  const { setCurrSection } = useContext(MenuContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const containerText = isDarkMode ? darkModeText : text;

  return (
    <View style={styles.headerContainer} key={`${props.slug}-section-header`}>
      <View/><Text style={containerText.sectionHeader1}>{props.title}</Text>
    </View>
  );
}

export default SectionHeader;
