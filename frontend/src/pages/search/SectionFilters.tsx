import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { baseStyles, darkStyles, text, darkModeText } from "../../styles/styles";
import { useTheme } from "src/components/ThemeContext";

const sections = [
  "Arts & Culture",
  "News",
  "Science",
  "Sports",
  "Opinion",
  "Projects",
  "Multimedia",
  "University News",
  "STEM",
  "Columns",
];

type SectionFiltersProps = {
  selectedSections: string[];
  setSelectedSections: Dispatch<SetStateAction<string[]>>;
};

function SectionFilters({
  selectedSections,
  setSelectedSections,
}: SectionFiltersProps) {
  const [tempSelectedSections, setTempSelectedSections] =
    useState<string[]>(selectedSections);

  useEffect(() => {
    setSelectedSections(tempSelectedSections);
  }, [tempSelectedSections]);

  const toggleSection = (section: string) => {
    if (tempSelectedSections.includes(section)) {
      setTempSelectedSections(
        tempSelectedSections.filter((s) => s !== section)
      );
    } else {
      setTempSelectedSections([section]);
    }
  };

  const { isDarkMode, toggleTheme } = useTheme();

  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  const textStyle = isDarkMode ? darkModeText : text;

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          style={[
            containerStyle.sectionFilterButton,
            tempSelectedSections.includes(section) ? containerStyle.selectedFilter : {},
          ]}
          onPress={() => toggleSection(section)}
        >
          <Text style={textStyle.sectionFilterText}>{section}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  button: {
    padding: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
  },
  selected: {
    backgroundColor: "#cccccc",
  },
  text: {
    color: "#333",
  },
});

export default SectionFilters;
