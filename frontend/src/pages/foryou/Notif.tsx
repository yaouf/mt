import { useState } from "react";
import { View, Text, Switch } from "react-native";
import { FYstyles } from "src/styles/foryou";

type NotifProps = { title: string; description: string };

function Notif({ title, description }: NotifProps) {
  const [notif, setNotif] = useState(true);

  return (
    <View style={FYstyles.toggleRow}>
      <View>
        <Text style={FYstyles.header}>{title}</Text>
        <Text style={FYstyles.text} numberOfLines={2} ellipsizeMode="tail">
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
