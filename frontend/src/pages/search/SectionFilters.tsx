import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const sections = [
  "Arts & Culture",
  "News",
  "Science",
  "Sports",
  "Opinion",
  "Post-magazine",
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
      setTempSelectedSections([...tempSelectedSections, section]);
    }
  };

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            tempSelectedSections.includes(section) ? styles.selected : {},
          ]}
          onPress={() => toggleSection(section)}
        >
          <Text style={styles.text}>{section}</Text>
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
