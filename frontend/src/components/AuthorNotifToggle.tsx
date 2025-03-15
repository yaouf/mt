import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import { Alert, Linking, Switch, Text, View } from "react-native";
import { updateAuthorSubscription } from "src/api/backendAPIs";
import { NotificationContext } from "src/pages/settings/NotificationProvider";
import { text } from "src/styles/styles";
import { getAsync, setAsync } from "src/utils/helpers";
import { Author } from "src/types/data";

type AuthorNotifProps = {
  author: Author;
  compact?: boolean;
};

function AuthorNotifToggle({ author, compact = false }: AuthorNotifProps) {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const {
    systemPermissionStatus,
    setSystemPermissionStatus,
    requestPermission,
    deviceID,
  } = useContext(NotificationContext);

  // Load subscription status on mount
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const subscribedAuthors = await getAsync("subscribedAuthors");
        if (subscribedAuthors) {
          const authors = JSON.parse(subscribedAuthors);
          setIsSubscribed(authors.some((a: string) => a === author.slug));
        }
      } catch (error) {
        console.error("Error loading author subscription:", error);
      }
    };

    loadSubscriptionStatus();
  }, [author.slug]);

  const updateAuthorSubscription = async (subscribed: boolean) => {
    try {
      // Get current subscribed authors from AsyncStorage
      const subscribedAuthors = await getAsync("subscribedAuthors");
      let authors: string[] = subscribedAuthors ? JSON.parse(subscribedAuthors) : [];
      
      if (subscribed) {
        // Add author if not already in the list
        if (!authors.includes(author.slug)) {
          authors.push(author.slug);
        }
      } else {
        // Remove author if in the list
        authors = authors.filter((slug: string) => slug !== author.slug);
      }
      
      // Save back to AsyncStorage
      await setAsync("subscribedAuthors", JSON.stringify(authors));
      
      // Update backend
      if (deviceID) {
        await updateAuthorSubscription(deviceID, author.slug, subscribed);
      }
    } catch (error) {
      console.error("Error updating author subscription:", error);
    }
  };

  const toggle = async () => {
    // Check notification permissions
    if (systemPermissionStatus === "granted") {
      const newValue = !isSubscribed;
      setIsSubscribed(newValue);
      updateAuthorSubscription(newValue);
    } else if (systemPermissionStatus === "denied") {
      Alert.alert(
        "Enable Notifications",
        "To subscribe to author notifications, please enable notifications for this app in your device settings.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("cancel"),
            style: "cancel",
          },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      // Request permission if not determined
      const status = await requestPermission();
      if (status === "granted") {
        setIsSubscribed(true);
        updateAuthorSubscription(true);
      }
      setSystemPermissionStatus(status);
    }
  };

  const toggleValue = systemPermissionStatus === "granted" && isSubscribed;

  if (compact) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Text style={{ ...text.notifSmall, marginRight: 8 }}>
          Receive notifications for {author.name}'s articles
        </Text>
        <Switch
          trackColor={{ true: "#000000", false: "grey" }}
          value={toggleValue}
          onValueChange={() => toggle()}
          accessibilityLabel={`Subscribe to ${author.name}'s articles`}
          accessibilityHint={`Toggle to enable or disable notifications for ${author.name}'s articles`}
          accessibilityRole="switch"
          accessibilityState={{ checked: toggleValue }}
        />
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={text.sectionHeader3}>
          {author.name}
        </Text>
        <Text style={text.notifSmall} ellipsizeMode="tail">
          Receive notifications when new articles are published
        </Text>
      </View>
      <Switch
        trackColor={{ true: "#000000", false: "grey" }}
        value={toggleValue}
        onValueChange={() => toggle()}
        accessibilityLabel={`Subscribe to ${author.name}'s articles`}
        accessibilityHint={`Toggle to enable or disable notifications for ${author.name}'s articles`}
        accessibilityRole="switch"
        accessibilityState={{ checked: toggleValue }}
      />
    </View>
  );
}

export default AuthorNotifToggle;