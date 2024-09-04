import { View, ScrollView, Image, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { baseStyles } from "../../styles/styles";
import { formatDates } from "src/code/formatDates";
import SplitArticle from "./SplitContent";
import { articleStyles } from "src/styles/article";
import BottomBar from "./BottomBar";
import { Article } from "src/types/data";
import { HomeStackProps } from "src/types/navStacks";
import { StackScreenProps } from "@react-navigation/stack";

// TODO: future - related articles
// links to other articles

function ArticleScreen({
  route,
  navigation,
}: StackScreenProps<HomeStackProps, "Article">) {
  const article: Article = route.params.data;

  return (
    <SafeAreaView>
      <ScrollView>

        <View style={baseStyles.container}>
          {/* Article title, lead, author, published date, section */}
          <View style={articleStyles.headingContainer}>
            <Text
              style={[
                articleStyles.title,
                article.dominantMedia.attachment_uuid
                  ? null
                  : { paddingTop: 30 },
              ]}
            >
              {article.headline}
            </Text>
            {article.subhead && (
              <Text style={articleStyles.lead}>{article.subhead}</Text>
            )}
            <View
              style={{
                height: 1,
                backgroundColor: "white",
                width: "100%",
                marginBottom: -15
              }}
            />
            </View>

            {article.dominantMedia.authors && (
          <View>
            <Image
              source={{
                uri: `https://snworksceo.imgix.net/bdh/${article.dominantMedia.attachment_uuid}.sized-1000x1000.${article.dominantMedia.extension}`,
              }}
              style={articleStyles.image}
            />
            <View style={baseStyles.container}>
              {(article.dominantMedia.content ||
                article.dominantMedia.authors) && (
                  <Text style={articleStyles.mediaCaption}>
                    {article.dominantMedia.content
                      ? article.dominantMedia.content
                          .replace("\n", " ")
                          .replace("<p>", "")
                          .replace("<p>", "")
                          .replace("</p>", "")
                          .replace(`<\/p>`, "")
                      : ""}
                    {article.dominantMedia.authors.length > 0 &&
                      " Media by: " +
                        article.dominantMedia.authors.map((mediaAuthor) => mediaAuthor.name).join(", ") +
                        " | The Brown Daily Herald"}
                  </Text>
              )}
            </View>
          </View>
        )}

            <View>
            <Text style={articleStyles.author}>
              {article.authors.map((author, i) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Staff", { slug: author.slug })
                  }
                >
                  <Text style={articleStyles.author}>
                    {author.name}
                    {i < article.authors.length - 1 ? ", " : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </Text>

            {/* Published date, section */}
            <View style={articleStyles.publishedDetails}>
              <Text style={articleStyles.publishedDetailsText}>
                {formatDates(article.published_at)}
              </Text>
            </View>
          </View>

          {/* Article text */}
          <SplitArticle content={article.content} />

          {/* Read more section, with small cards */}
          {/* <Divider />
          <Text style={articleStyles.readMoreHeading}>RELATED ARTICLES</Text>
          <View style={layout.grid}>
            <SmallCard article={dummyData[0]} navigation={navigation} />
            <SmallCard article={dummyData[1]} navigation={navigation} />
            <SmallCard article={dummyData[2]} navigation={navigation} />
            <SmallCard article={dummyData[3]} navigation={navigation} />
          </View> */}
          {/* </View> */}
        </View>
        <View style={{height: 80}}></View>
      </ScrollView>
      <BottomBar
        published_at={article.published_at}
        slug={article.slug}
        uuid={article.uuid}
      />
    </SafeAreaView>
  );
}

export default ArticleScreen;
