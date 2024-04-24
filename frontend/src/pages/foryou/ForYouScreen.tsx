import React from "react";
import { View, Text } from "react-native";
import FaveSections from "./sections/FavSections";
import { dummyData } from "src/dummyData";
import { FYstyles } from "src/styles/foryou";
import Archive from "./sections/Archive";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import StayUpdated from "./sections/StayUpdated";
import Trending from "./sections/Trending";
import Recommended from "./sections/Recommended";
import TodaysPicks from "./sections/TodaysPicks";
import Divider from "src/components/Divider";
import { useScrollToTop } from "@react-navigation/native";

/**
 * for you page!!
 *
 * @returns for you screen
 */
function ForYouScreen() {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return (
    <GestureHandlerRootView>
      <ScrollView ref={ref}>
        <View style={{ marginLeft: 16, marginRight: 16 }}>
          <Text style={FYstyles.introtext}>
            Recommended stories, your favorite sections, and more.
          </Text>
          <Divider small={true} />
          <FaveSections title="Arts & Culture" data={dummyData} />
          <Divider />
          <Archive date="" article={dummyData[1]} />
          <Divider />
          <StayUpdated />
          <Divider />
          <Trending data={dummyData.slice(0, 3)} />
          <Divider />
          <Recommended data={dummyData.slice(0, 4)} />
          <Divider />
          <TodaysPicks data={dummyData} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default ForYouScreen;
