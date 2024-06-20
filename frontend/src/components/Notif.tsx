import { useState } from "react";
import { View, Text, Switch } from "react-native";
import { fyp } from "src/styles/pages";
import { text } from "src/styles/styles";

type NotifProps = { title: string; description: string };

function Notif({ title, description }: NotifProps) {
  const [notif, setNotif] = useState(true);

  return (
    <View style={fyp.toggleRow}>
      <View>
        <Text style={text.sectionHeader3}>{title}</Text>
        <Text style={text.textSmall} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
      <Switch
        value={notif}
        onValueChange={() =>
          setNotif((previousState: boolean) => !previousState)
        }
      />
    </View>
  );
}

export default Notif;
