import React, { useState } from "react";
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

function SectionFilters() {
  const [selectedSections, setSelectedSections] = useState([]);

  const toggleSection = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedSections.includes(section) ? styles.selected : null,
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
