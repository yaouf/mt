import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { fetchAuthor } from "src/code/fetchContent";
import Divider from "src/components/Divider";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { layout, text } from "src/styles/styles";
import { Article, Author, Media, StaffProps } from "src/types/types";

function Staff({ route, navigation }: StaffProps) {
  const [author, setAuthor] = useState<Author | undefined>();
  const [articles, setArticles] = useState<Article[] | undefined>();
  const [media, setMedia] = useState<Media[] | undefined>();
  const [posts, setPosts] = useState<string[] | undefined>();

  const slug = route.params.slug;

  useEffect(() => {
    fetchAuthor(slug, setAuthor, setArticles, setMedia, setPosts).then(() =>
      console.log(`loaded ${slug}`)
    );
  }, []);

  console.log("____", posts);

  if (!author || !articles || !media || !posts) {
    return <Text>Loading!!</Text>;
  }

  return (
    <ScrollView style={{ marginLeft: 16, marginRight: 16 }}>
      <View style={layout.vStack}>
        <Text style={text.text}>{author.name}</Text>
        <Text style={text.text}>{author.tagline}</Text>
        <Divider />
        <Text style={text.sectionHeader1}>Bio</Text>
        <Text style={text.text}>{author.bio}</Text>
      </View>

      {articles.length > 0 && (
        <View style={layout.vStack}>
          <Divider />
          <Text style={text.sectionHeader1}>Articles</Text>
          {articles.map((article: Article, i) => (
            <HorizontalCard
              article={article}
              navigation={navigation}
              key={`sports-home-${i + 2}`}
            />
          ))}
        </View>
      )}

      {media.length > 0 && (
        <View style={layout.vStack}>
          <Divider />
          <Text style={text.sectionHeader1}>Media</Text>
          {media.map((media: Media, i) => (
            <Text>{media.attachment_uuid}</Text>
            // <HorizontalCard
            //   article={article}
            //   navigation={navigation}
            //   key={`sports-home-${i + 2}`}
            // />
          ))}
        </View>
      )}

      {posts.length > 0 && (
        <View style={layout.vStack}>
          <Divider />
          <Text style={text.sectionHeader1}>Blog Posts</Text>
          <Text>{posts}</Text>
        </View>
      )}
    </ScrollView>
  );
}

export default Staff;
