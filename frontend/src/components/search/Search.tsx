import { useRef, useState } from "react";
import { View, Pressable, Text, TextInput, FlatList } from "react-native";
import Item from "./Item";
import { baseStyles } from "../../styles/styles";
import { searchBarStyles } from "../../styles/searchbar";
import CustomButton from "../CustomButton";
import { SearchProps } from "src/types/types";

function Search(props: SearchProps) {
  const textInputRef = useRef<TextInput>(null);

  // determines whether search is activated
  const [searchActivated, setSearchActivated] = useState(false);

  // determines whether search is submitted
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const handleSearch = () => {
    // handle search button press
    setSearchActivated(true);
  };

  const [text, onChangeText] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [articles, setArticles] = useState([]);

  const handleSearchCompletion = async () => {
    try {
      // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
      const response = await fetch(
        `https://www.browndailyherald.com/search.json?a=1&o=date&s=${text}`
      );
      const jsonString = await response.text();
      setSearchResults(jsonString); // Sets search results, format this later

      const resultObject = JSON.parse(jsonString); // Parse string into an object
      setSearchResults(resultObject);

      const articleList = resultObject.items; // List of articles
      setArticles(articleList);
    } catch (error) {
      console.error("Error" + error);
    }
    setSearchSubmitted(true);
  };

  const handleSearchCancel = () => {
    setSearchActivated(false);
    setSearchSubmitted(false);
    textInputRef.current?.blur();
  };

  return (
    <View style={baseStyles.container}>
      {searchActivated && searchSubmitted && (
        <View
          style={[
            searchBarStyles.searchContainer,
            {
              position: "absolute",
              top: props.scrollPositionText + 30,
              maxHeight: props.screenHeight * (25 / 32),
            },
          ]}
        >
          <FlatList
            data={articles}
            renderItem={({ item }) => <Item item={item} />}
            style={{ width: "70%" }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      )}

      {searchActivated && (
        <View
          style={[
            searchBarStyles.searchContainer,
            { position: "absolute", top: props.scrollPositionText },
          ]}
        >
          <TextInput
            onChangeText={onChangeText}
            ref={textInputRef}
            value={text}
            placeholder="Search"
            autoFocus={true}
            onSubmitEditing={handleSearchCompletion}
          />
          <Pressable
            onPress={handleSearchCancel}
            style={searchBarStyles.searchCancel}
          >
            <Text style={{ fontSize: 17 }}>{"\u2715"}</Text>
          </Pressable>
        </View>
      )}

      {!searchActivated && (
        <View
          style={[
            searchBarStyles.searchButton,
            { position: "absolute", top: props.scrollPositionButton },
          ]}
        >
          <CustomButton text="Search" onPress={handleSearch} />
        </View>
      )}
    </View>
  );
}

export default Search;
