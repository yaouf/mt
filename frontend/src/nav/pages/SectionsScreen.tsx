import { useState, useRef } from "react";
import { View, Button, Pressable, Text, TextInput, Dimensions, 
  FlatList } from "react-native";
import { WebView } from "react-native-webview";
import { searchBarStyles } from "../../styles/searchbar";
import CustomButton from "../../components/CustomButton";
import Item from "../../components/Item";

/**
 * Page for sections
 *   - links to the different section pages
 *   - for links, see hamburger of current site
 *   - depending on design, might show some articles from each section too, like nyt
 *
 * @returns Sections screen
 */
function SectionsScreen() {
  const [open, setOpen] = useState<boolean>(false);
  const [link, setLink] = useState<string>("https://www.browndailyherald.com");
  const webviewRef = useRef<WebView>(null);
  const textInputRef = useRef<TextInput>(null);

  // retrieves screen height
  const screenHeight = Dimensions.get('window').height;

  // determines whether search is activated
  const [searchActivated, setSearchActivated] = useState(false)

  // determines whether search is submitted
  const [searchSubmitted, setSearchSubmitted] = useState(false)

  const [text, onChangeText] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [articles, setArticles] = useState([]);

  const sections: string[] = [
    // maybe dict of section to link would be better in case future sections have different names
    // wait or can we get the list of section titles from the website directly in case the site changes
    "NEWS",
    "ARTS & CULTURE",
    "SPORTS",
    "SCIENCE & RESEARCH",
    "OPINIONS",
    "PROJECTS",
    "POST MAGAZINE",
    "MULTIMEDIA",
  ];

  function redirectSection(s: string): void {
    s = s.replace(" & ", "-");
    console.log(s);
    setLink(`https://www.browndailyherald.com/section/${s}`);
    setOpen(true);
  }

  const handleSearch = () => {
    // handle search button press
    setSearchActivated(true)
  };

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
    setSearchSubmitted(true)
  };

  const handleSearchCancel = () => {
    setSearchActivated(false);
    setSearchSubmitted(false)
    textInputRef.current?.blur();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!open ? (
        sections.map((s) => (
          <Pressable key={s} onPress={() => redirectSection(s)}>
            <Text>{s}</Text>
          </Pressable>
        ))
      ) : (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <WebView
              originWhitelist={["*"]}
              ref={webviewRef}
              source={{ uri: link }}
              allowsBackForwardNavigationGestures={true}
            />
          </View>
          <View style={{ position: "absolute" }}>
            <Button onPress={() => setOpen(false)} title="Back" color="#000" />
          </View>
        </View>
      )}

    {searchActivated && searchSubmitted &&
        <View style={[searchBarStyles.searchContainer, { position: 'absolute', top: ((30/812) * screenHeight) + 30, maxHeight: screenHeight * (25/32)}]}>
      <FlatList
        data={articles}
        renderItem={({ item }) => <Item item={item} />}
        style={{ width: "70%" }}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      </View>}

    {searchActivated &&
      <View style={[searchBarStyles.searchContainer, { position: 'absolute', top: (30/812) * screenHeight }]}>
      <TextInput onChangeText={onChangeText} ref={textInputRef} value={text} placeholder="Search" autoFocus={true} onSubmitEditing={handleSearchCompletion}/>
      <Pressable onPress={handleSearchCancel} style={searchBarStyles.searchCancel}>
        <Text style={{fontSize: 17}}>{'\u2715'}</Text>
      </Pressable>
      </View>}

    {!searchActivated &&
    <View style={[searchBarStyles.searchButton, { position: 'absolute', top: (30/812) * screenHeight }]}>
        <CustomButton text= "Search" onPress={handleSearch}  />
      </View>}

    </View>
  );
}

export default SectionsScreen;
