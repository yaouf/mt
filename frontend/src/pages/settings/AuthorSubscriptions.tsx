import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchAuthor } from "src/api/fetchContent";
import AuthorNotifToggle from "src/components/AuthorNotifToggle";
import { baseStyles, text, varGray1 } from "src/styles/styles";
import { Author } from "src/types/data";
import { NavProp } from "src/types/navStacks";
import { getAsync } from "src/utils/helpers";

function AuthorSubscriptions({ navigation }: NavProp) {
  const [subscribedAuthors, setSubscribedAuthors] = useState<string[]>([]);
  const [authorData, setAuthorData] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        const storedAuthors = await getAsync("subscribedAuthors");
        if (storedAuthors) {
          const authors = JSON.parse(storedAuthors);
          setSubscribedAuthors(authors);
          
          // Fetch data for each author
          const authorPromises = authors.map(async (slug: string) => {
            return new Promise<Author | null>((resolve) => {
              fetchAuthor(
                slug,
                (author) => resolve(author || null),
                () => {},
                () => {},
                () => {}
              ).catch(() => resolve(null));
            });
          });
          
          const results = await Promise.all(authorPromises);
          const validAuthors = results.filter((a): a is Author => a !== null);
          setAuthorData(validAuthors);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading author subscriptions:", error);
        setLoading(false);
      }
    };
    
    loadSubscriptions();
    
    // Set up navigation listener to refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadSubscriptions);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <ActivityIndicator
        color={varGray1}
        style={{ flex: 1 }}
        accessibilityLabel="Loading subscribed authors"
      />
    );
  }

  return (
    <SafeAreaView style={baseStyles.container}>
      <View style={{ flex: 1, paddingTop: 16 }}>
        <Text style={text.sectionHeader1}>Author Notifications</Text>
        <Text style={{ ...text.textMedium, marginTop: 8, marginBottom: 16 }}>
          Get notified when your favorite authors publish new articles.
        </Text>
        
        {authorData.length > 0 ? (
          <FlatList
            data={authorData}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16 }}>
                <AuthorNotifToggle author={item} />
              </View>
            )}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <Text style={text.textMedium}>
              You haven't subscribed to any authors yet.
            </Text>
            <Text style={{ ...text.textMedium, marginTop: 8, textAlign: 'center', paddingHorizontal: 24 }}>
              Visit an article or author page and subscribe to receive notifications when they publish new content.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default AuthorSubscriptions;