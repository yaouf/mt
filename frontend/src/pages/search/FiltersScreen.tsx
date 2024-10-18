import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import SectionFilters from "./SectionFilters";
import { Ionicons } from "@expo/vector-icons";
import { SearchStackProps } from "src/types/navStacks";

function FiltersScreen({
  route,
  navigation,
}: 
  SearchStackProps<"Filters\">;
) {
  const [sortOption, setSortOption] = useState("newest");
  const searchType = route.params.searchMode 
  const search
  
    // const [searchMode, setS] = useState("Article");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sort by</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSortOption("newest")}
      >
        <Text style={styles.optionText}>Newest</Text>
        <View
          style={[
            styles.radioCircle,
            sortOption === "newest" ? styles.selected : null,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSortOption("oldest")}
      >
        <Text style={styles.optionText}>Oldest</Text>
        <View
          style={[
            styles.radioCircle,
            sortOption === "oldest" ? styles.selected : null,
          ]}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Sections</Text>
      <SectionFilters />

      <Text style={styles.header}>Type</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSearchType("Article")}
      >
        <Text style={styles.optionText}>Article</Text>
        <View
          style={[
            styles.radioCircle,
            searchType === "Article" ? styles.selected : null,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSearchType("Writer")}
      >
        <Text style={styles.optionText}>Writer</Text>
        <View
          style={[
            styles.radioCircle,
            searchType === "Writer" ? styles.selected : null,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSearchType("Photographer")}
      >
        <Text style={styles.optionText}>Photographer</Text>
        <View
          style={[
            styles.radioCircle,
            searchType === "Photographer" ? styles.selected : null,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    paddingTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});

export default FiltersScreen;
