import { StyleSheet, Text, View } from "react-native";
import { baseStyles, text } from "src/styles/styles";

const s = StyleSheet.create({
  rowStyles: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 8,
    width: "90%",
  },
});

function DevTeam() {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 16 }}>
      <Text style={text.sectionHeader1}>Dev Team</Text>

      <View style={{ marginTop: 8 }}>
        <View style={s.rowStyles}>
          <Text style={text.textMedium}>🗞️</Text>
          <Text style={text.textMedium}>
            Leadership: Charlie Clynes '25, Jakobi Haskell '25, Max Karpawich '24
          </Text>
        </View>

        <View style={s.rowStyles}>
          <Text style={text.textMedium}>📱</Text>
          <Text style={text.textMedium}>
            Front end: Kiera Walsh '24, Rachel Chae '25, Annika Singh '26, Kara
            Wong '26, Nayani Modugula '26
          </Text>
        </View>

        <View style={s.rowStyles}>
          <Text style={text.textMedium}>🌐</Text>
          <Text style={text.textMedium}>
            Back end: Jakobi Haskell '25, Calvin Eng '25, Sana Saab '27, Yassir
            Aouf '27
          </Text>
        </View>

        <View style={s.rowStyles}>
          <Text style={text.textMedium}>🎨</Text>
          <Text style={text.textMedium}>
            Design: Grace Chen '24, Audrey Chou '26, Emily Lin
            '26, Jesse Hogan '24
          </Text>
        </View>
      </View>
    </View>
  );
}

export default DevTeam;
