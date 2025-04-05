import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MenuContext } from "src/pages/home/HomeStackScreen";
import { text } from "src/styles/styles";
import { darkModeText } from "src/styles/styles";
import { useTheme } from "./ThemeContext";

const styles = StyleSheet.create({
  opinionsHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 12,
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
    <View style={styles.opinionsHeaderContainer} key={`${props.slug}-section-header`}>
      <View/><Text style={containerText.sectionHeader1}>{props.title}</Text>
    </View>
  );
}

export default SectionHeader;