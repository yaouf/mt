import { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { varGray1, varTextColor } from "../../styles/styles";
import { search } from "src/styles/search";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/navStacks";
import HorizontalCard from "../../components/cards/HorizontalCard";
import { Article } from "src/types/data";
import { trackEvent } from "@aptabase/react-native";

const { width: screenWidth } = Dimensions.get("window");

function Search({ navigation }: NavProp) {
  const textInputRef = useRef<TextInput>(null);
  const [searchActivated, setSearchActivated] = useState(false);
  const [text, onChangeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [searchType, setSearchType] = useState("Article");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sortType, setSortType] = useState("date");

  const handleSearch = async () => {
    setLoading(true);
    trackEvent("search", { text });
    try {
      let queryUrl = "https://www.browndailyherald.com/search.json?a=1";
      if (searchType === "Writer" || searchType === "Photographer") {
        queryUrl += `&au=${text}`;
      } else if (searchType === "Article") {
        queryUrl += `&s=${text}&ty=article`;
      }
      // if (selectedSections.length > 0) {
      //   const sectionsQuery = selectedSections
      //     .map((section) => `section=${section}`)
      //     .join("&");
      //   queryUrl += `&tg=${selectedSections[0]}`;
      // }
      if (selectedSections.length > 0) {
        queryUrl += `&tg=${selectedSections[0]}`;
      }

      if (sortType == "date") {
        queryUrl += `&o=date`;
      }
      const response = await fetch(queryUrl);
      const jsonString = await response.text();
      const resultObject = JSON.parse(jsonString);
      const articleList: Article[] = resultObject.items;

      setArticles(articleList);
      setLoading(false);
      setSearchCompleted(true);
    } catch (error) {
      setLoading(false);
      console.error("Error" + error);
    }
  };

  const handleSearchCancel = () => {
    setSearchActivated(false);
    textInputRef.current?.clear();
    textInputRef.current?.blur();
    setSearchCompleted(false);
    onChangeText("");
    Animated.timing(animatedWidth, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleClearText = () => {
    onChangeText("");
    textInputRef.current?.focus();
  };

  const handleFocus = () => {
    setSearchActivated(true);
    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const inputWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "80%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Animated.View style={[styles.inputContainer, { width: inputWidth }]}>
          <MaterialIcons
            name="search"
            size={20}
            color={varGray1}
            style={styles.searchIcon}
            accessible={false}
          />
          <TextInput
            onChangeText={onChangeText}
            ref={textInputRef}
            value={text}
            placeholder="Search"
            style={styles.input}
            onFocus={handleFocus}
            onSubmitEditing={handleSearch}
            accessibilityLabel="Search input"
            accessibilityHint="Enter keywords to search for articles"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Filters", {
                searchType,
                setSearchType,
                selectedSections,
                setSelectedSections,
                sortType,
                setSortType,
              })
            }
          >
            <MaterialIcons
              name="tune"
              size={20}
              color={varGray1}
              style={styles.searchIcon}
              accessible={false}
            />
          </TouchableOpacity>
          {text.length > 0 && (
            <TouchableOpacity
              onPress={handleClearText}
              accessibilityLabel="Clear search text"
            >
              <Ionicons name="close-circle" size={20} color={varGray1} />
            </TouchableOpacity>
          )}
        </Animated.View>
        {searchActivated && (
          <TouchableOpacity
            onPress={handleSearchCancel}
            accessibilityLabel="Cancel search"
            accessibilityHint="Clear search input and cancel search"
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {!searchCompleted && !loading && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Search for an article to get started.
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Image
            source={require("assets/logo-black.png")}
            style={search.img}
            resizeMode="contain"
            accessible={false}
          />
        </View>
      )}

      {searchCompleted && (
        <FlatList
          data={articles}
          renderItem={({ item, index }) => (
            <HorizontalCard
              article={item}
              navigation={navigation}
              key={`search-result-${index}`}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }}></View>}
          contentContainerStyle={styles.resultsContainer}
          initialNumToRender={8}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: varTextColor,
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingTop: 16,
  },
});

export default Search;
