import { trackEvent } from "@aptabase/react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { fetchEditorsPicks, fetchMostPopular } from "src/api/fetchContent";
import { Article, EditorsPickArticle } from "src/types/data";
import { NavProp } from "src/types/navStacks";
import ImageCard from "../../components/cards/HorizontalCard";
import { varGray1, varTextColor } from "../../styles/styles";
import { Section_Type } from "../home/HomeScreen";
import EditorsPicks from "../home/sections/EditorsPicks";
import MostPopular from "../home/sections/MostPopular";
import SectionFilters from "./SectionFilters";

// const { width: screenWidth } = Dimensions.get('window');

const SearchSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonDate} />
        </View>
      </View>
    </View>
  );
};

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

  const [usingPrefetchedData, setUsingPrefetchedData] = useState(true);

  useEffect(() => {
    const loadPrefetchedData = async () => {
      try {
        // Try to load prefetched data
        const prefetchedEditorsPicks = await AsyncStorage.getItem(
          "prefetchedEditorsPicks"
        );
        const prefetchedPopularStories = await AsyncStorage.getItem(
          "prefetchedPopularStories"
        );

        if (prefetchedEditorsPicks && prefetchedPopularStories) {
          setEditorsPicksStories(JSON.parse(prefetchedEditorsPicks));
          setMostPopularStories(JSON.parse(prefetchedPopularStories));
          setTopLoaded(true);
        } else {
          setUsingPrefetchedData(false);
        }
      } catch (error) {
        console.error("Error loading prefetched data:", error);
        setUsingPrefetchedData(false);
      }
    };

    loadPrefetchedData();
  }, []);

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

  const [topLoaded, setTopLoaded] = useState(false);
  const [mostPopularStories, setMostPopularStories] = useState<Article[]>();
  const [editorsPicksStories, setEditorsPicksStories] = useState<
    EditorsPickArticle[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!usingPrefetchedData) {
      fetchEditorsPicks()
        .then((articles) => {
          setEditorsPicksStories(articles);
        })
        .catch((error) => {
          const errorParsed = JSON.parse(error as string);
          console.log("errorParsed", errorParsed);
          console.error("Failed to load editor's picks:", errorParsed);
        });
      fetchMostPopular()
        .then((articles) => {
          setMostPopularStories(articles);
        })
        .catch((error) => {
          console.error("Failed to load most popular:", error);
        });
    }
  }, [usingPrefetchedData]);

  useEffect(() => {
    if (!usingPrefetchedData) {
      fetchEditorsPicks();
      fetchMostPopular();
    }
  }, [usingPrefetchedData]);

  const onRefresh = async () => {
    setRefreshing(true);
    setUsingPrefetchedData(false);
    console.log("starting fetch to editors picks");
    setTimeout(async () => {
      try {
        const editorsPicks = await fetchEditorsPicks();
        setEditorsPicksStories(editorsPicks);
      } catch (error) {
        const errorParsed = JSON.parse(error as string);
        console.log("errorParsed", errorParsed);
        console.error("Failed to fetch editor's picks:", errorParsed);
      }
    }, 100);
    console.log("starting fetch to most popular");
    const mostPopular = await fetchMostPopular();
    setMostPopularStories(mostPopular);
    setRefreshing(false);
  };

  // const onLayoutRootView = useCallback(async () => {
  //   if (topLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [topLoaded]);

  // if (!topLoaded) {
  //   return null;
  // }

  const sections: Section_Type[] = [
    {
      id: 1,
      component:
        editorsPicksStories.length > 0 ? (
          <EditorsPicks
            editorsPicksStories={editorsPicksStories}
            navigation={navigation}
          />
        ) : null,
    },
    {
      id: 2,
      component: mostPopularStories ? (
        <MostPopular
          mostPopularStories={mostPopularStories}
          navigation={navigation}
        />
      ) : null,
    },
  ];

  const [isSortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState(sortType);
  const [isSectionVisible, setSectionVisible] = useState(false);
  const [isTypeVisible, setTypeVisible] = useState(false);

  const [searchMode, setSearchMode] = useState(searchType);
    
  const drawerAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    const shouldOpen = isSortVisible || isSectionVisible || isTypeVisible;
    if (shouldOpen) {
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } 
    else {
      Animated.timing(drawerAnim, {
        toValue: 100,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  });

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: 500,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSortVisible(false);
      setSectionVisible(false);
      setTypeVisible(false)
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* <TouchableOpacity
          onPress={() => navigation.push("FilterScreen")}
          accessibilityLabel="Open filter drawer"
        >
          <MaterialIcons
            name="tune"
            size={20}
            color={varGray1}
            style={styles.searchIcon}
            accessible={false}
          />
        </TouchableOpacity> */}
        <View style={styles.searchBarContainer}>
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
          {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate("FiltersScreen", {
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
          </TouchableOpacity> */}
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
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortVisible(true)}
            accessibilityLabel="Cancel search"
            accessibilityHint="Clear search input and cancel search"
            accessibilityRole="button"
          >
            <View style={styles.filterContent}>
            <Text style={styles.filterText}>Sort</Text>
            <Ionicons name="chevron-down-outline" size={22} color={varTextColor} />
            </View>
          </TouchableOpacity>
          <Modal
            transparent
            animationType="fade"
            visible={isSortVisible}
            onRequestClose={() => setSortVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => closeDrawer()}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.bottomDrawer, { transform: [{ translateY: drawerAnim }] }]}>
              <View style={styles.drawerTop}>
              <Text style={styles.drawerTitle}>Sort by</Text>
                         </View>
               <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSortOption("date")}
                      >
                        <Text style={styles.optionText}>Date</Text>
                        <View
                          style={[
                            styles.radioCircle,
                            sortOption === "date" ? styles.selected : {},
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSortOption("title")}
                      >
                        <Text style={styles.optionText}>Title</Text>
                        <View
                          style={[
                            styles.radioCircle,
                            sortOption === "title" ? styles.selected : {},
                          ]}
                        />
                      </TouchableOpacity>
            </Animated.View>
          </Modal>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSectionVisible(true)}
            accessibilityLabel="Section"
            accessibilityHint="Section search results"
          >
            <View style={styles.filterContent}>
            <Text style={styles.filterText}>Section</Text>
            <Ionicons name="chevron-down-outline" size={22} color={varTextColor} />
            </View>
          </TouchableOpacity>

          <Modal
            transparent
            animationType="fade"
            visible={isSectionVisible}
            onRequestClose={() => setSectionVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => closeDrawer()}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.bottomDrawer, { transform: [{ translateY: drawerAnim }] }]}>
              <View style={styles.drawerTop}>
              <Text style={styles.drawerTitle}>Sections</Text>
                         </View>
                         <SectionFilters
          selectedSections={selectedSections}
          setSelectedSections={setSelectedSections}
        />
            </Animated.View>
          </Modal>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setTypeVisible(true)}
            accessibilityLabel="Type"
            accessibilityHint="Type search filters"
          >
            <View style={styles.filterContent}>
            <Text style={styles.filterText}>Type</Text>
            <Ionicons name="chevron-down-outline" size={22} color={varTextColor} />
            </View>
  </TouchableOpacity>

  <Modal
            transparent
            animationType="fade"
            visible={isTypeVisible}
            onRequestClose={() => setTypeVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => closeDrawer()}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.bottomDrawer, { transform: [{ translateY: drawerAnim }] }]}>
              <View style={styles.drawerTop}>
              <Text style={styles.drawerTitle}>Type</Text>
            </View>
                        <TouchableOpacity
                                  style={styles.optionContainer}
                                  onPress={() => setSearchMode("Article")}
                                >
                                  <Text style={styles.optionText}>Article</Text>
                                  <View
                                    style={[
                                      styles.radioCircle,
                                      searchMode === "Article" ? styles.selected : {},
                                    ]}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.optionContainer}
                                  onPress={() => {
                                    setSearchMode("Writer");
                                  }}
                                >
                                  <Text style={styles.optionText}>Writer</Text>
                                  <View
                                    style={[
                                      styles.radioCircle,
                                      searchMode === "Writer" ? styles.selected : {},
                                    ]}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.optionContainer}
                                  onPress={() => setSearchMode("Photographer")}
                                >
                                  <Text style={[styles.optionText, { paddingBottom: 10 }]}>
                                    Photographer
                                  </Text>
                                  <View
                                    style={[
                                      styles.radioCircle,
                                      searchMode === "Photographer" ? styles.selected : {},
                                    ]}
                                  />
                                </TouchableOpacity>
            </Animated.View>
          </Modal>
  
        </View>
      </View>

      {!searchCompleted && !loading && (
        <View accessibilityLabel="Search Results">
          {topLoaded && (
            <FlatList
              data={sections.filter((section) => section.component !== null)}
              renderItem={({ item }) => item.component}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={{ marginHorizontal: 16 }}></View>
              )}
              initialNumToRender={1}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              accessibilityLabel="Section Headers List"
            />
          )}
        </View>
      )}

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]} // Show 3 skeleton items
          renderItem={() => <SearchSkeleton />}
          ItemSeparatorComponent={() => <View style={{ height: 16 }}></View>}
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        searchCompleted &&
        (articles.length > 0 ? (
          <FlatList
            data={articles}
            renderItem={({ item, index }) => (
              <ImageCard
                article={item}
                navigation={navigation}
                key={`search-result-${index}`}
                inSearch={true}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }}></View>}
            contentContainerStyle={styles.resultsContainer}
            initialNumToRender={8}
          />
        ) : (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>No results found.</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Skeleton Search
  skeletonCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    height: 100,
  },
  skeletonImage: {
    width: 85,
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  skeletonContent: {
    flex: 1,
    padding: 6,
    paddingLeft: 30,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    width: "90%",
  },
  skeletonDate: {
    height: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    width: "40%",
  },
  // Search
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBarContainer: {
    flexDirection: "row", 
    alignItems: "center"
  },
  filterButtons: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 8
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderColor: "#9E9E9E",
    borderWidth: 1,
    borderRadius: 18,
  },
  filterContent: {
    flexDirection: "row"
  },
  filterText: {
    color: varTextColor,
    fontSize: 16,
    flexShrink: 1,
    marginRight: 8,
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
  textDrawer: {
    color: varTextColor,
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  bottomDrawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    },
  
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  drawerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default Search;
