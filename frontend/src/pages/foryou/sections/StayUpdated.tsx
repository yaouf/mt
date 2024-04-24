import { View, Text, Switch } from "react-native";
import Notif from "./Notif";
import { text } from "src/styles/styles";

function StayUpdated() {
  return (
    <View>
      <Text style={text.sectionHeader3}>STAY UPDATED</Text>
      <View style={{ rowGap: 16 }}>
        <Notif
          title="Author Name"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
        />
        <Notif
          title="Section Name"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
        />
        <Notif
          title="Breaking News"
          description="Lorem ipsum dolor sit amet consectetur eleifend enim elementum et at
  faucibus"
        />
      </View>
    </View>
  );
}

export default StayUpdated;
