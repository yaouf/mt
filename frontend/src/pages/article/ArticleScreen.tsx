import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Article, ArticleProps } from "../../types/types";
import { baseStyles, font1, font2, font3, layout } from "../../styles/styles";
import { dummyData } from "../../dummyData";
import SmallCard from "src/components/cards/SmallCard";
import { formatDates } from "src/code/formatDates";

import Divider from "src/components/Divider";
import { useContext, useEffect, useState } from "react";
import { SavedContext } from "../Nav";
import SplitArticle from "./SplitContent";
import { articleStyles } from "src/styles/article";
import BottomBar from "./BottomBar";

// TODO: dummy content still as the recommended stories

function ArticleScreen({ route, navigation }: ArticleProps) {
  const article: Article = route.params.data;

  return (
    <View>
      <ScrollView>
        {/* Header image */}
        <Image
          source={{
            uri:
              "https://snworksceo.imgix.net/bdh/" +
              article.dominantMedia.attachment_uuid +
              ".sized-1000x1000.jpg?w=1000",
          }}
          style={articleStyles.image}
        />

        {/* Container for text, rest of article */}
        <View style={articleStyles.container}>
          {/* Media caption, author */}
          <View style={articleStyles.mediaDetails}>
            <Text style={articleStyles.mediaCaption}>
              {article.dominantMedia.content}
            </Text>
            <Text style={articleStyles.mediaAuthor}>
              {article.dominantMedia.authors.length > 0 &&
                article.dominantMedia.authors.map(
                  (mediaAuthor) => mediaAuthor.name
                )}
            </Text>
          </View>

          {/* Article title, lead, author, published date, section */}
          <View style={articleStyles.articleHeading}>
            <Text style={articleStyles.title}>{article.headline}</Text>
            <Text style={articleStyles.lead}>{article.subhead}</Text>
            <Text style={articleStyles.author}>
              {article.authors.map((author) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("Staff", { slug: author.slug })
                  }
                >
                  <Text style={articleStyles.author}>{author.name}</Text>
                </TouchableOpacity>
              ))}
            </Text>

            {/* Published date, section */}
            <View style={articleStyles.publishedDetails}>
              <Text style={articleStyles.publishedDate}>
                {formatDates(article.published_at)}
              </Text>
              <Text style={articleStyles.section}>{article.tags[0].name}</Text>
            </View>
          </View>

          {/* Article text */}
          <SplitArticle content={article.content} />
          {/* Read more section, with small cards */}
          <Divider />
          <Text style={articleStyles.readMoreHeading}>RELATED ARTICLES</Text>
          <View style={layout.grid}>
            <SmallCard article={dummyData[0]} navigation={navigation} />
            <SmallCard article={dummyData[1]} navigation={navigation} />
            <SmallCard article={dummyData[2]} navigation={navigation} />
            <SmallCard article={dummyData[3]} navigation={navigation} />
          </View>
        </View>
      </ScrollView>
      <BottomBar
        published_at={article.published_at}
        slug={article.slug}
        uuid={article.uuid}
      />
    </View>
  );
}

export default ArticleScreen;
