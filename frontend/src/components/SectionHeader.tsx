// import { NativeBaseProvider } from "native-base";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    paddingTop: 8,
    paddingRight: 16,
    paddingLeft: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  seeMoreButton: {
    fontWeight: "bold",
    color: "#ED1C24",
    fontSize: 12,
    marginRight: 16,
  },
});

const SectionHeader = ({ title, onSeeMorePress }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity onPress={onSeeMorePress}>
      <Text style={styles.seeMoreButton}>See more</Text>
    </TouchableOpacity>
  </View>
);

export default SectionHeader;
