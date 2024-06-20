import { Text, View } from "react-native";
import { DoneProps, MenuItem } from "../types/types";
import { useEffect } from "react";
import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";
import { baseStyles } from "src/styles/styles";

const menuItems: MenuItem[] = [
  { id: 3, title: "opinions", slug: "opinions" },
  { id: 4, title: "university news", slug: "university-news" },
  { id: 5, title: "arts & culture", slug: "arts-culture" },
  { id: 6, title: "metro", slug: "metro" },
  { id: 7, title: "sports", slug: "sports" },
  { id: 8, title: "science & research", slug: "science-research" },
  { id: 9, title: "podcast", slug: "podcast" },
  // TODO: are we including post, multimedia, special projects ... and what order
];

function DoneScreen(props: DoneProps) {
  const userProps = props.route.params;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  console.log("done screen");
  async function redirect(wait: boolean) {
    if (wait) {
      await delay(5000);
    }
    userProps.setHasOnboarded(true);
    setAsync("hasOnboarded", "true");
    setAsync("savedArticles", JSON.stringify({}));
    setAsync("sectionMenu", JSON.stringify(menuItems));
  }

  useEffect(() => {
    redirect(true);
  }, []);

  return (
    <View style={baseStyles.container}>
      <Text>Welcome to the BDH app! (add loading screen)</Text>
      <CustomButton text="Done!" onPress={() => redirect(false)} />
    </View>
  );
}

export default DoneScreen;
