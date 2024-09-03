import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MenuContext } from "src/pages/home/HomeStackScreen";
import { text } from "src/styles/styles";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
<<<<<<< Updated upstream
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
=======
    alignItems: "flex-start"
>>>>>>> Stashed changes
  },
});

type SectionHeaderProps = {
  navigation: StackNavigationProp<any, any>;
  slug: string;
  title: string;
};

function SectionHeader(props: SectionHeaderProps) {
  const { setCurrSection } = useContext(MenuContext);


  return (
    <View style={styles.headerContainer} key={`${props.slug}-section-header`}>
<<<<<<< Updated upstream
      <View style={styles.accent}></View><Text style={text.sectionHeader1}>{props.title}</Text><View></View>
=======
      <View style={styles.accent}></View><Text style={text.sectionHeader1}>{props.title}</Text>
>>>>>>> Stashed changes
    </View>
  );
}

export default SectionHeader;
