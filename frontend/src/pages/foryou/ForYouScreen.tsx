import React from "react";
import { View, Text } from "react-native";
import FaveSections from "./sections/FavSections";
import { dummyData } from "src/dummyData";
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
import { text } from "src/styles/styles";
import { NavProp } from "src/types/types";

/**
 * for you page!!
 *
 * @returns for you screen
 */
function ForYouScreen({ navigation }: NavProp) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return (
    <GestureHandlerRootView>
      <ScrollView ref={ref}>
        <View style={{ marginLeft: 16, marginRight: 16 }}>
          <Text style={text.sectionHeader2}>
            Recommended stories, your favorite sections, and more.
          </Text>
          <Divider marginTop={8} />
          <FaveSections
            title="Arts & Culture"
            data={dummyData}
            navigation={navigation}
          />
          <Divider />
          <Archive date="" article={dummyData[1]} navigation={navigation} />
          <Divider />
          <StayUpdated />
          <Divider />
          <Trending data={dummyData.slice(0, 3)} navigation={navigation} />
          <Divider />
          <Recommended data={dummyData.slice(0, 4)} navigation={navigation} />
          <Divider />
          <TodaysPicks data={dummyData} navigation={navigation} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default ForYouScreen;
