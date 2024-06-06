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
import { shareArticle } from "./ShareArticle";
import { formatDates } from "src/code/formatDates";

import Divider from "src/components/Divider";
import { getAsync, removeAsync, setAsync, updateAsync } from "src/code/helpers";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { SavedContext } from "../Nav";
import { Ionicons } from "@expo/vector-icons";
import SplitArticle from "./SplitContent";
import { articleStyles } from "src/styles/article";

function ArticleScreen({ route, navigation }: ArticleProps) {
  const article: Article = route.params.data;

  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (article.uuid in savedArticles) {
      setSaved(true);
    }
  }, [savedArticles]);

  function handleShare() {
    shareArticle(`https://browndailyherald.com/${article.uuid}`);
  }

  function handleBookmark() {
    updateAsync(
      "SavedArticles",
      savedArticles,
      article.uuid,
      !saved,
      setSavedArticles
    ).then(() => setSaved((prev) => !prev));
  }

  // not doing individual article/section notifs for now
  // function handleNotification() {}

  return (
    <ScrollView>
      {/* Overall container */}
      <View style={baseStyles.container}>
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
              {article.authors.map((author) => author.name)}
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

          {/* Actions -  share, save, notifications*/}
          <View style={articleStyles.actionBar}>
            <View style={articleStyles.actions}>
              {/* <TouchableOpacity onPress={() => handleNotification()}>
                <Image
                  source={require("../../../assets/icons/notifications.png")}
                  style={styles.icon}
                />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => handleBookmark()}>
                {/* <Image
                  source={require("../../../assets/icons/bookmarks.png")}
                  style={styles.icon}
                /> */}
                {saved ? (
                  <Ionicons name="bookmark" size={24} color="#1C1B1F" />
                ) : (
                  <Ionicons name="bookmark-outline" size={24} color="#1C1B1F" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare()}>
                <Image
                  source={require("../../../assets/icons/share.png")}
                  style={articleStyles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ArticleScreen;
