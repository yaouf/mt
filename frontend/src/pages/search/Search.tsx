import { useRef, useState, useEffect } from "react";
import { View, TextInput, FlatList, Image, Text, Button } from "react-native";
import { varGray1 } from "../../styles/styles";
import { search } from "src/styles/search";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/navStacks";
import HorizontalCard from "../../components/cards/HorizontalCard";
import { Article } from "src/types/data";
import {trackEvent} from "@aptabase/react-native";

function Search({ navigation }: NavProp) {
  const textInputRef = useRef<TextInput>(null);

  const [searchActivated, setSearchActivated] = useState(false);
  const [text, onChangeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSearch = async () => {
    setSearchActivated(false);
    setLoading(true);
    trackEvent("search", {text});
    try {
      const response = await fetch(
        `https://www.browndailyherald.com/search.json?a=1&o=date&s=${text}&ty=article`
      );
      const jsonString = await response.text();
      const resultObject = JSON.parse(jsonString);
      const articleList: Article[] = resultObject.items;

      setArticles(articleList);
      setLoading(false)
      setSearchCompleted(true); // Hide the logo when search is completed
    } catch (error) {
      setLoading(false);
      console.error("Error" + error);
    }
  };

  const handleSearchCancel = () => {
    setSearchActivated(false);
    textInputRef.current?.clear();
    textInputRef.current?.blur();
    setSearchCompleted(false); // Show the logo again if search is canceled
  };

  return (
    
    <View>

      <View style={search.searchbar}>
        <MaterialIcons
          name="search"
          size={24}
          color={varGray1}
          style={{ marginHorizontal: 8 }}
          accessible={false}
        />
        <TextInput
          onChangeText={onChangeText}
          ref={textInputRef}
          value={text}
          placeholder="Search"
          autoFocus={true}
          style={search.searchText}
          onFocus={() => setSearchActivated(true)}
          onSubmitEditing={handleSearch} // Handle search on submit
          accessibilityLabel="Search input"
          accessibilityHint="Enter keywords to search for articles"
        />
        {searchActivated && (
          <TouchableOpacity
            onPress={handleSearchCancel}
            style={search.searchCancel}
            accessibilityLabel="Cancel search"
            accessibilityHint="Clear search input and cancel search"
            accessible={true}
            accessibilityRole="button"
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={varGray1}
              style={{ marginHorizontal: 8 }}
              accessible={false}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={search.container}>
        {!searchCompleted && (loading ?
          <Image
            source={require("assets/logo-black.png")}
            style={search.img}
            resizeMode="contain"
            accessible={false}
          />
        :
        <Text
          style={{
            color: "gray",
            marginVertical: 300,
            alignSelf: "center",
          }}
        >
          Search for an article to get started.
        </Text>
      )}
      </View>
      
      <View>
        {searchCompleted &&
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
            style={{ marginTop: 16, marginBottom: 186 }}
            initialNumToRender={8}
          />
        }
      </View>
      
    </View>
  );
}

export default Search;
