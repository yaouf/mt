// import { NativeBaseProvider } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MenuContext } from "src/pages/home/HomeStackScreen";
import { text } from "src/styles/styles";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});

type SectionHeaderProps = {
  navigation: StackNavigationProp<any, any>;
  slug: string;
  title: string;
};

function SectionHeader(props: SectionHeaderProps) {
  const { setCurrSection } = useContext(MenuContext);

  const viewMore = () => {
    setCurrSection(props.slug);
    props.navigation.push("Section", { slug: props.slug });
  };

  return (
    <View style={styles.headerContainer} key={`${props.slug}-section-header`}>
      <Text style={text.sectionHeader1}>{props.title}</Text>
      <TouchableOpacity onPress={viewMore}>
        <Text style={text.seeMore}>See more</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SectionHeader;
