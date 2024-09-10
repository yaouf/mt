import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { fetchAuthor } from "src/code/fetchContent";
import Divider from "src/components/Divider";
import HorizontalCard from "src/components/cards/HorizontalCard";
import { baseStyles, layout, text, varGray1 } from "src/styles/styles";
import { articleStyles } from "src/styles/article";
import { Article, Author, Media } from "src/types/data";
import { SettingsStackProps } from "src/types/navStacks";

function Staff({
  route,
  navigation,
}: StackScreenProps<SettingsStackProps, "Staff">) {
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

  if (!author || !articles || !media || !posts) {
    return <ActivityIndicator color={varGray1} style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={baseStyles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            marginBottom: 14,
            marginTop: 24,
          }}
        >
          {author.metadata && (
            <Image
              source={{ uri: author.metadata[0].value }}
              style={{ width: 64, height: 64, borderRadius: 50 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={text.sectionHeader1}>{author.name}</Text>
            {author.tagline !== "" && (
              <Text
                style={{
                  ...text.textMedium,
                  fontStyle: "italic",
                  marginTop: 4,
                }}
              >
                {author.tagline}
              </Text>
            )}
          </View>
        </View>

        {author.bio !== "" && (
          <View>
            <Divider marginTop={0} marginBottom={8} />
            <Text style={{ ...articleStyles.articleBody, marginTop: 8 }}>
              {author.bio
                .replaceAll("<p>", "")
                .replaceAll("</p>", "")
                .replaceAll("&amp;", "&")}
            </Text>
          </View>
        )}
      </View>

      {articles.length > 0 && (
        <View>
          <Divider marginTop={10} marginBottom={10} />
          <Text style={text.sectionHeader1}>Recent Articles</Text>
          <View style={{height: 10}}></View>
          <View style={layout.recentArticlesStack}>
            {articles.map((article: Article, i) => (
              <HorizontalCard
                article={article}
                navigation={navigation}
                key={`sports-home-${i + 2}`}
              />
            ))}
          </View>
        </View>
      )}

      {media.length > 0 && (
        <View>
          <Divider marginTop={18} marginBottom={8} />
          <Text style={text.sectionHeader1}>Media</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 16,
              columnGap: 12,
              marginTop: 16,
            }}
          >
            {media.map((media: Media, i) => (
              <Image
                key={i}
                source={{
                  uri: `http://snworksceo.imgix.net/bdh/${media.attachment_uuid}.sized-1000x1000.${media.preview_extension}`,
                }}
                style={{ width: 170, height: 150 }}
                onError={(error) =>
                  console.log(
                    "Image load error:",
                    media.attachment_uuid,
                    media.preview_extension
                  )
                }
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default Staff;
