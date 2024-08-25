import { useRef, useState } from "react";
import { View, TextInput, FlatList, SafeAreaView } from "react-native";
import { varGray1 } from "../../styles/styles";
import { search } from "src/styles/search";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { NavProp } from "src/types/navStacks";
import HorizontalCard from "../../components/cards/HorizontalCard";
import { Article } from "src/types/data";

function Search({ navigation }: NavProp) {
  const textInputRef = useRef<TextInput>(null);

  const [searchActivated, setSearchActivated] = useState(false);
  const [text, onChangeText] = useState("");
  const [searchCompleted, setSearchCompleted] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);

  // TODO: the ty tag is set to just return articles for now to avoid erroring since media and pages can be returned too
  const handleSearch = async () => {
    setSearchActivated(false);
    try {
      // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
      const response = await fetch(
        `https://www.browndailyherald.com/search.json?a=1&o=date&s=${text}&ty=article`
      );
      const jsonString = await response.text();
      const resultObject = JSON.parse(jsonString); // Parse string into an object
      const articleList: Article[] = resultObject.items; // List of articles

      setArticles(articleList);
    } catch (error) {
      console.error("Error" + error);
    }
    setSearchCompleted(true);
  };

  const handleSearchCancel = () => {
    setSearchActivated(false);
    textInputRef.current?.clear();
    textInputRef.current?.blur();
  };

  return (
    <View>
      <View style={search.searchbar}>
        <MaterialIcons
          name="search"
          size={24}
          color={varGray1}
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          onChangeText={onChangeText}
          ref={textInputRef}
          value={text}
          placeholder="Search"
          autoFocus={true}
          style={search.searchText}
          onFocus={() => setSearchActivated(true)}
          onSubmitEditing={handleSearch}
        />
        {searchActivated && (
          <TouchableOpacity
            onPress={handleSearchCancel}
            style={search.searchCancel}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={varGray1}
              style={{ marginHorizontal: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
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
            style={{ marginTop: 16 }}
            initialNumToRender={8}
          />
        )}
      </View>
    </View>
  );
}

export default Search;
