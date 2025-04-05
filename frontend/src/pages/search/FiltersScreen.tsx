import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SectionFilters from "./SectionFilters";
import { Ionicons } from "@expo/vector-icons";
import { SearchStackProps } from "src/types/navStacks";
import { baseStyles, darkStyles, text, darkModeText } from "../../styles/styles";
import { useTheme } from "src/components/ThemeContext";

function FiltersScreen({ route, navigation }) {
  const {
    searchType,
    setSearchType,
    selectedSections,
    setSelectedSections,
    sortType,
    setSortType,
  } = route.params;
  const [searchMode, setSearchMode] = useState(searchType);
  const [sortOption, setSortOption] = useState(sortType);

  useEffect(() => {
    setSearchType(searchMode);
    console.log("after searchMode:", searchMode);
    console.log("after searchType:", searchType);
  }, [searchMode, searchType]);

  useEffect(() => {
    setSortType(sortOption);
    console.log("after searchMode:", sortOption);
    console.log("after searchType:", sortType);
  }, [sortOption, sortType]);

  const { isDarkMode, toggleTheme } = useTheme();

  const containerStyle = isDarkMode ? darkStyles : baseStyles;
  const textStyle = isDarkMode ? darkModeText : text;
  const arrowColor = isDarkMode ? "white" : "black";

  return (
    <View style={[containerStyle.container, {flex: 1} ]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={arrowColor} />
      </TouchableOpacity>
      <ScrollView style={containerStyle.container}>
        <Text style={textStyle.filterHeader}>Sort by</Text>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => setSortOption("date")}
        >
          <Text style={textStyle.filterText}>Date</Text>
          <View
            style={[
              textStyle.radioCircle,
              sortOption === "date" ? textStyle.selectedRadioCircle : {},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => setSortOption("title")}
        >
          <Text style={textStyle.filterText}>Title</Text>
          <View
            style={[
              textStyle.radioCircle,
              sortOption === "title" ? textStyle.selectedRadioCircle : {},
            ]}
          />
        </TouchableOpacity>
        <Text style={textStyle.filterHeader}>Sections</Text>
        <SectionFilters
          selectedSections={selectedSections}
          setSelectedSections={setSelectedSections}
        />

        <Text style={textStyle.filterHeader}>Type</Text>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => setSearchMode("Article")}
        >
          <Text style={textStyle.filterText}>Article</Text>
          <View
            style={[
              textStyle.radioCircle,
              searchMode === "Article" ? textStyle.selectedRadioCircle : {},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {
            setSearchMode("Writer");
          }}
        >
          <Text style={textStyle.filterText}>Writer</Text>
          <View
            style={[
              textStyle.radioCircle,
              searchMode === "Writer" ? textStyle.selectedRadioCircle : {},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => setSearchMode("Photographer")}
        >
          <Text style={[textStyle.filterText, { paddingBottom: 10 }]}>
            Photographer
          </Text>
          <View
            style={[
              textStyle.radioCircle,
              searchMode === "Photographer" ? textStyle.selectedRadioCircle : {},
            ]}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
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
  backButton: {
    marginTop: 15,
    marginLeft: 15,
  },
});

export default FiltersScreen;
