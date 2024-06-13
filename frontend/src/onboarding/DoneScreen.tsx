import { Text, View } from "react-native";
import { DoneProps } from "../types/types";
import { useEffect } from "react";
import CustomButton from "../components/CustomButton";
import { setAsync } from "../code/helpers";

function DoneScreen(props: DoneProps) {
  const userProps = props.route.params;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function redirect(wait: boolean) {
    if (wait) {
      await delay(5000);
    }
    userProps.setHasOnboarded(true);
    setAsync("hasOnboarded", "true");
    setAsync("savedArticles", JSON.stringify({}));
  }

  useEffect(() => {
    redirect(true);
  }, []);

  return (
    <View>
      <Text>Welcome to the BDH app! (add loading screen)</Text>
      <CustomButton text="Done!" onPress={() => redirect(false)} />
    </View>
  );
}

export default DoneScreen;
