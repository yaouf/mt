import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { text, varTextColor } from 'src/styles/styles';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';

type SettingsLinkProps = {
  title: string;
  link: string;
  inApp?: boolean;
  navigation?: StackNavigationProp<any, any>;
};

// const layout = StyleSheet.create({})

function SettingsLink({ title, link, inApp, navigation }: SettingsLinkProps) {
  const openLink = async (link: string) => {
    if (inApp && navigation) {
      navigation.navigate(link);
    } else {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await WebBrowser.openBrowserAsync(link);
      } else {
        console.error("Don't know how to open URI: " + link);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={() => openLink(link)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12, // because 4 in the other padding
      }}
      accessible={true}
      accessibilityLabel={`${title} link`}
      accessibilityHint={`Press to open ${title} link`}
      accessibilityRole="button"
    >
      <Text style={{ ...text.notifSmall, fontSize: 16 }}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color={varTextColor} />
    </TouchableOpacity>
  );
}

export default SettingsLink;
