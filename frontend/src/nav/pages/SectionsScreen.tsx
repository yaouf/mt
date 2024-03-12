import { useState, useRef } from "react";
import { View, Text, Pressable, Button } from "react-native";
import { WebView } from "react-native-webview";

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
    </View>
  );
}

export default SectionsScreen;
