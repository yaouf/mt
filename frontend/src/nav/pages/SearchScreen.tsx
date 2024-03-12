import { View, Text, TextInput, FlatList } from "react-native";
import { styles } from "../../styles/search";
import React, { useState } from "react";
import Item from "../../components/Item";
import CustomButton from "../../components/CustomButton";

/**
 * Page for search (separate page just for now)
 *   - native search component makes call to search api, returns results
 *
 * @returns Search screen
 */
function SearchScreen() {
  const [text, onChangeText] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [articles, setArticles] = useState([]);

  const fetchSearchResults = async () => {
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
      console.log(articleList);
    } catch (error) {
      console.error("Error" + error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.titleText}>Search</Text>
      <TextInput
        onChangeText={onChangeText}
        placeholder="Input Query Here!"
        value={text}
        style={{
          paddingLeft: 50,
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 3,
          marginBottom: 10,
          borderRadius: 20,
          alignContent: "center",
        }}
      />
      <CustomButton onPress={fetchSearchResults} text={"Submit"}></CustomButton>
      <FlatList
        data={articles}
        renderItem={({ item }) => <Item item={item} />}
        style={{ width: "70%" }}
      />
    </View>
  );
}

export default SearchScreen;
