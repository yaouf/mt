import { View, Text, Switch } from "react-native";
import { FYstyles } from "src/styles/foryou";
import Notif from "./Notif";

function StayUpdated() {
  return (
    <View>
      <Text style={FYstyles.header}>STAY UPDATED</Text>
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
