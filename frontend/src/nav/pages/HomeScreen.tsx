import { WebView, WebViewNavigation } from "react-native-webview";
import { useRef, useState } from "react";
import {
  View,
  Button,
  Pressable,
  Text,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import Item from "../../components/Item"
import { HomeProps } from "../../types/types";
import { baseStyles } from "../../styles/styles";
import { searchBarStyles } from "../../styles/searchbar";
import SmallCard from "src/components/cards/SmallCard";
import LargeCard from "src/components/cards/LargeCard";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { dummyData } from "../../dummyData";
import Search from "src/components/Search";
import CustomButton from "../../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalScrollMenu from "../../components/HorizontalScrollMenu";
import All from '../../components/sections/All';
import News from "src/components/sections/News";
import Sports from "src/components/sections/Sports";

/**
 * Home screen with embedded web view
 *
 * @param param navigation param from BDH parent component
 * @returns Home Screen
 */
interface MenuItem {
  id: number;
  title: string;
}

interface Section_Type {
  id: number;
  title: string;
  component: React.ReactNode;
}

const sections: Section_Type[] = [
  { id: 1, title: 'All', component: <All /> },
  { id: 2, title: 'News', component: <News /> },
  { id: 3, title: 'Sports', component: <Sports /> },
  // Add more sections here
];

function HomeScreen({ navigation }: HomeProps) {
  const webviewRef = useRef<WebView>(null);
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  // scroll to section top  
  const handleMenuClick = (item: MenuItem) => {
    // Logic to scroll to the corresponding section based on the index
    const index = sections.findIndex(section => section.id === item.id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };


  // retrieves screen height
  const screenHeight = Dimensions.get("window").height;


  // sets position of search button
  const [scrollPositionButton, setScrollPositionButton] = useState(
    0.03 * screenHeight
  );


  // sets position of search text input box
  const [scrollPositionText, setScrollPositionText] = useState(
    0.03 * screenHeight
  );


  // determines whether search is activated
  const [searchActivated, setSearchActivated] = useState(false);


  // determines whether search is submitted
  const [searchSubmitted, setSearchSubmitted] = useState(false);


  // initializes percentage of content offset
  const [offsetPercent, setOffsetPercent] = useState(0);


  // handle navigation state change
  const handleNavigationStateChange = (navState: any) => {
    if (navState.canGoBack) {
      navigation.setOptions({
        headerLeft: () => (
          <Button
            onPress={() => webviewRef.current?.goBack()}
            title="Back"
            color="#000"
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  };


  // determine whether to load the request or not
  const shouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url || "";


    // Check if the URL contains the specific string
    if (url.includes("/article/")) {
      // Redirect to Article component
      navigation.push("Article", { articleUrl: url });
      // Do not load the URL
      return false;
    }
    // Continue loading for other URLs
    return true;
  };


  // determines position of scroll
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;


    if (contentOffset.y > 120) {
      // if scrolled down more than height of search bar, fix the search bar at top of screen
      setScrollPositionButton((40 / 812) * screenHeight);
      setScrollPositionText((45 / 812) * screenHeight);
    } else {
      // makes content offset into a ratio
      setOffsetPercent(contentOffset.y / 812);


      // keep search bar unfixed on WebView
      setScrollPositionButton((159 / 812 - offsetPercent) * screenHeight);
      setScrollPositionText((165 / 812 - offsetPercent) * screenHeight);
    }
  };


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


  // const handleLinkPress = () => {
  //   navigation.push('Article', { articleUrl: url })
  // }

  return (
    <View style={baseStyles.container}>
      {searchActivated && searchSubmitted && (
        <View
          style={[
            searchBarStyles.searchContainer,
            {
              position: "absolute",
              top: scrollPositionText + 20,
              maxHeight: screenHeight * (25 / 32),
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
            { position: "absolute", top: scrollPositionText },
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
            { position: "absolute", top: scrollPositionButton },
          ]}
        >
          <CustomButton text="Search" onPress={handleSearch} />
        </View>
      )}
      <HorizontalScrollMenu onItemClick={handleMenuClick}/>
      {/* <ScrollView ref={scrollViewRef}> */}
      {/* <FlatList >
      <All />
      <SmallCard article={dummyData[0]} />
      </FlatList> */}
      
      <FlatList
        ref={flatListRef}
        data={sections}
        renderItem={({item}) => item.component}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
      />
        
        {/* </ScrollView> */}
      
  

      {/* <WebView
        // originWhitelist={[
        //   "https://www.browndailyherald.com*",
        //   "https://projects.browndailyherald.com*",
        // ]}
        originWhitelist={["*"]}
        ref={webviewRef}
        source={{ uri: "https://www.browndailyherald.com/" }}
        style={baseStyles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
        onScroll={handleScroll}
      /> */}
    </View>
  );
}

export default HomeScreen;
