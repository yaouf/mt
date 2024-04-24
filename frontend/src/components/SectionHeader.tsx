// import { NativeBaseProvider } from "native-base";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { text } from "src/styles/styles";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    paddingTop: 8,
  },
});

function SectionHeader({ title, onSeeMorePress }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={text.sectionHeader1}>{title}</Text>
      <TouchableOpacity onPress={onSeeMorePress}>
        <Text style={text.seeMore}>See more</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SectionHeader;
