import { View, Text, StyleSheet } from "react-native";
import { Article, ArticleProps, SectionProps } from "../../types/types";
import { baseStyles, font1, font2, font3, layout } from "../../styles/styles";

function SectionsScreen({ route, navigation }: SectionProps) {
  const slug = route.params.slug;
  return (
    <View>
      <Text>{slug}</Text>
    </View>
  );
}

export default SectionsScreen;

const styles = StyleSheet.create({});
