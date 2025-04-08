import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CardProps } from 'src/types/navStacks';
import { font1, font3, varGray1, varPink, varTextColor } from '../../styles/styles';
import { formatDates } from '../../utils/formatDates';
import { Tag } from 'src/types/data';

function NoImageCard({ article, navigation }: CardProps) {
  let cardSize: StyleProp<ViewStyle> = { minWidth: '100%' };
  const all_tags = article.tags.map((t: Tag) => t.name);
  const section = all_tags[0].replace('&;', '&');

  return (
    <View style={cardSize}>
      <TouchableWithoutFeedback
        style={styles2.touchableItem}
        onPress={() => navigation.push('Article', { data: article })}
      >
        <View
          style={[
            styles.card,
            section == 'post- magazine' && {
              backgroundColor: varPink,
              padding: '5%',
              borderRadius: 15,
            },
          ]}
        >
          <View style={styles.text}>
            <Text style={styles.title}>{article.headline}</Text>
            {article.subhead && article.subhead.trim() !== '' && (
              <Text style={styles.subhead}>{article.subhead}</Text>
            )}
            <View
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
                <View style={styles.authorLine}>
                  <Text style={styles.published}>By</Text>
                  {article.authors.map((author, i) => {
                    const lastIndex = article.authors.length - 1;
                    let separator = "";

                    if (i > 0 && i < lastIndex) {
                      separator = ", ";
                    } else if (i === lastIndex && i !== 0) {
                      separator = " and ";
                    }

                    return (
                      <View key={author.slug} style={styles.authorWrapper}>
                        <Text style={styles.published}>{separator}</Text>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Staff", { slug: author.slug })
                          }
                        >
                          <Text style={styles.authorName}>{author.name}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.published}>
                {formatDates(article.published_at)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default NoImageCard;

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableItem: {
    width: 200,
    height: 200,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showContextButton: {
    position: 'absolute',
    bottom: 10, // Adjust as per your requirement
    right: 10, // Adjust as per your requirement
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  title: {
    height: 'auto',
    alignSelf: 'stretch',
    color: varTextColor,
    fontFamily: font1,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    overflow: 'hidden',
    flexWrap: 'nowrap',
    marginBottom: 4,
  },
  card: {
    display: 'flex',
    // width: 170,
    // width: "48%",
    flexDirection: 'column',
    alignItems: 'stretch',
    borderWidth: 0,
    backgroundColor: '#FFF',
    // shadowColor: varTextColor,
    // shadowOffset: {
    //   width: 0,
    //   height: 1.497,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 29.949,
    // elevation: 3,
    overflow: 'visible',
  },
  section: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 10,
    fontStyle: 'normal',
    // fontWeight: "500",
    /* lineHeight: 'normal',*/
  },
  published: {
    color: varGray1,
    fontFamily: font3,
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    // fontWeight: "500",
    /* line-height: normal; */
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: 4,
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  subhead: {
    alignSelf: 'stretch',
    color: varTextColor,
    fontFamily: font1,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  publishedSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  line: {
    width: 254,
    height: 0.5,
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
  },
  authorLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  authorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    color: "grey",
    fontFamily: font3,
    fontSize: 12,
    fontWeight: "900",
    fontStyle: "normal",
  },
});
