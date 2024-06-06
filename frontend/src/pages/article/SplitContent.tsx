import { View, Image, Text } from "react-native";
import { articleStyles } from "src/styles/article";
import {
  HTMLContentModel,
  HTMLElementModel,
  RenderHTML,
} from "react-native-render-html";

type SplitArticleType = {
  content: string;
};

function SplitArticle({ content }: SplitArticleType) {
  const source = {
    html: content,
  };

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
            <Text style={articleStyles.adAuthor}>Ad Author</Text>
          </View>

          {/* article continued */}
          <RenderHTML
            source={source2}
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
            <Text style={articleStyles.adAuthor}>Ad Author</Text>
          </View>

          {/* article continued */}
          <RenderHTML
            source={source3}
            baseStyle={articleStyles.text}
            customHTMLElementModels={customHTMLElementModels}
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
            <Text style={articleStyles.adAuthor}>Ad Author</Text>
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
