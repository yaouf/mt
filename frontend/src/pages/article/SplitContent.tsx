import { View, Image, Text, Linking } from "react-native";
import { articleStyles } from "src/styles/article";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Article } from "src/types/data";
import { Dispatch, SetStateAction, useState } from "react";
import { fetchArticle } from "src/code/fetchContent";
import * as WebBrowser from 'expo-web-browser';

type SplitArticleType = {
  content: string;
};

function SplitArticle({ content }: SplitArticleType) {
  const source = {
    html: content,
  };
  
  const [article, setArticle] = useState<Article | undefined>();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const customHTMLElementModels = {
    a: HTMLElementModel.fromCustomModel({
      tagName: "a",
      mixedUAStyles: articleStyles.hyperlink,
      contentModel: HTMLContentModel.textual,
    }),
  };

  var splitContent = source.html.split("\n");
  var char = "\n";
  if (splitContent.length == 1) {
    char = "</p><p>";
    splitContent = source.html.split("</p><p>");
  }
  if (splitContent.length >= 15) {
    const source1 = {
      html: "",
    };
    splitContent.map((val, index) => {
      if (index <= splitContent.length / 3) {
        source1.html += val + char;
      }
    });
    const source2 = {
      html: "",
    };
    splitContent.map((val, index) => {
      if (
        index > splitContent.length / 3 &&
        index <= (2 * splitContent.length) / 3
      ) {
        source2.html += val + char;
      }
    });
    const source3 = {
      html: "",
    };
    splitContent.map((val, index) => {
      if (index > (2 * splitContent.length) / 3) {
        source3.html += val + char;
      }
    });

    // navigates to new article screen in stack
    const handleLinkPress = async (
      event: any,
      href: string,
      setArticle: Dispatch<SetStateAction<Article | undefined>>
    ) => {
      // checks if url is article
      const articleBaseURL = "https://www.browndailyherald.com/article/";
      if (href.startsWith(articleBaseURL)) {
        try {
          // fetch article data
          const seg = href.split("/"); // splits href into slug and date

          const slug = seg.pop(); // retrieves slug

          const month = seg.pop(); // retrieves date month
          const year = seg.pop(); //retrieves date year
          const date = year + "-" + month;

          // check if slug, year, or month is invalid
          if (!slug || !year || !month) {
            throw new Error("Invalid URL format");
          }
          
          const  fetchedArticle = await fetchArticle(slug, date, setArticle)
          setArticle(fetchedArticle);
          // navigate to Article screen with fetched article data
          console.log(slug)
          navigation.push('Article', { data: fetchedArticle });
      }
        // handle article error
        catch (error) {
          console.error('Error fetching article:', error);
        }
      }
      // opens url in web browser if not article
      else {
        await WebBrowser.openBrowserAsync(href);
      }
    };

    return (
      <View style={articleStyles.articleBodyWrapper}>
        <View style={articleStyles.articleBody}>
          <RenderHTML
            source={source1}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
            renderersProps={{
              a: {
                onPress: (event, href) =>
                  handleLinkPress(event, href, setArticle),
              },
            }}
          />

          {/* Advertisement block */}
          <View style={articleStyles.advert}>
            <Image
              source={{
                uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
              }}
              style={articleStyles.adImage}
            />
            <Text style={articleStyles.adAuthor}>Ad Author</Text>
          </View>

          {/* article continued */}
          <RenderHTML
            source={source2}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
            renderersProps={{
              a: {
                onPress: (event, href) =>
                  handleLinkPress(event, href, setArticle),
              },
            }}
          />

          {/* Advertisement block */}
          <View style={articleStyles.advert}>
            <Image
              source={{
                uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
              }}
              style={articleStyles.adImage}
            />
            <Text style={articleStyles.adAuthor}>Ad Author</Text>
          </View>

          {/* article continued */}
          <RenderHTML
            source={source3}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
            renderersProps={{
              a: {
                onPress: (event, href) =>
                  handleLinkPress(event, href, setArticle),
              },
            }}
          />
        </View>
      </View>
    );
  } else {
    const source1 = {
      html: "",
    };
    splitContent.map((val, index) => {
      if (index <= splitContent.length / 2) {
        source1.html += val + char;
      }
    });
    const source2 = {
      html: "",
    };
    splitContent.map((val, index) => {
      if (index > splitContent.length / 2) {
        source2.html += val + char;
      }
    });

    return (
      <View style={articleStyles.articleBodyWrapper}>
        <View style={articleStyles.articleBody}>
          <RenderHTML
            source={source1}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
          />

          {/* Advertisement block */}
          <View style={articleStyles.advert}>
            <Image
              source={{
                uri: "https://www.peacemakersnetwork.org/wp-content/uploads/2019/09/placeholder.jpg",
              }}
              style={articleStyles.adImage}
            />
            <Text style={articleStyles.adAuthor}>Advertisement</Text>
          </View>

          {/* article continued */}
          <RenderHTML
            source={source2}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
          />
        </View>
      </View>
    );
  }
}

export default SplitArticle;
