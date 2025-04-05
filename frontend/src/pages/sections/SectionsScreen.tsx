import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { fetchSection } from 'src/api/fetchContent';
import ImageCard from 'src/components/cards/HorizontalCard';
import LargeSectionCard from 'src/components/cards/LargeSectionCard';
import NoImageCard from 'src/components/cards/NoImageCard';
import Divider from 'src/components/Divider';
import { Article } from 'src/types/data';
import { HomeStackProps } from 'src/types/navStacks';
import { baseStyles, layout, text, varGray1 } from '../../styles/styles';

// If reaches the end of the list, loads the next page of content
// (another api call but with page= page+ 1 unless page=last page)

type ArticleGroup = {
  type: 'large' | 'noImage' | 'image';
  articles: Article[];
  id: string;
};

/**
 * Renders vertical list of articles for a section (e.g. "University News", "Metro")
 * @param param0
 * @returns
 */
function SectionsScreen({ route, navigation }: StackScreenProps<HomeStackProps, 'Section'>) {
  const slug = route.params.slug;
  const [section, setSection] = useState<Article[]>([]);
  const [rows, setRows] = useState<ArticleGroup[]>([]);
  const [title, setTitle] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Convert articles array into vertical groups for efficient rendering
  useEffect(() => {
    const newGroups: ArticleGroup[] = [];
    if (section.length > 0) {
      // First article gets its own group
      newGroups.push({
        type: 'large',
        articles: [section[0]],
        id: `${slug}-group-0`,
      });

      // Rest of the articles alternate between noImage and image pairs
      // Each group contains 2 articles displayed vertically
      let isNoImage = true;
      for (let i = 1; i < section.length; i += 2) {
        const pair = section.slice(i, i + 2);
        if (pair.length === 2) {
          newGroups.push({
            type: isNoImage ? 'noImage' : 'image',
            articles: pair,
            id: `${slug}-group-${i}`,
          });
          isNoImage = !isNoImage;
        }
      }
    }
    setRows(newGroups);
  }, [section, slug]);

  const loadPage = async (page: number, shouldAppend = false) => {
    try {
      const [sectionTitle, lastPageNum, newArticles] = await fetchSection(
        slug,
        page,
        (articles) => {
          if (shouldAppend && articles) {
            setSection((prev) => [...prev, ...articles]);
          } else if (articles) {
            setSection(articles);
          }
        }
      );

      if (!shouldAppend) {
        setTitle(sectionTitle as string);
      }
      setLastPage(lastPageNum as number);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  // Loads the first page of content when the screen is loaded
  useEffect(() => {
    setSection([]);
    setTitle(undefined);
    setLastPage(undefined);
    setCurrentPage(1);
    loadPage(1);
  }, [slug]);

  // Loads more content when the user reaches the end of the list
  const loadMore = async () => {
    // If already loading more or no more pages or already on last page, don't load more
    if (isLoadingMore || !lastPage || currentPage >= lastPage) return;

    setIsLoadingMore(true);
    await loadPage(currentPage + 1, true);
    setIsLoadingMore(false);
  };

  // Refreshes the list when the user pulls down to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPage(1);
    setRefreshing(false);
  };

  const renderGroup = ({ item }: { item: ArticleGroup }) => {
    if (item.type === 'large') {
      return (
        <View>
          <LargeSectionCard article={item.articles[0]} navigation={navigation} inSearch={false} />
          <Divider />
        </View>
      );
    }

    const CardComponent = item.type === 'noImage' ? NoImageCard : ImageCard;

    return (
      <View style={layout.vStack}>
        {item.articles.map((article, i) => (
          <View key={`${item.id}-${i}`}>
            <CardComponent article={article} navigation={navigation} inSearch={false} />
            <Divider />
          </View>
        ))}
      </View>
    );
  };

  // Renders a loading indicator at the bottom of the list when loading more content
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <ActivityIndicator color={varGray1} style={{ padding: 20 }} />;
  };

  return (
    <View>
      <View style={baseStyles.container}>
        <View>
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={renderGroup}
            ListHeaderComponent={
              slug != 'post-magazine' ? <Text style={text.bigTitle}>{title}</Text> : undefined
            }
            ListFooterComponent={renderFooter}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            removeClippedSubviews={true} // Added to reduce memory usage
            maxToRenderPerBatch={3} // Added to reduce memory usage
            windowSize={3} // Added to reduce memory usage
            onEndReached={loadMore} // function to load more content
            onEndReachedThreshold={1} // threshold that determines when to load more
            scrollIndicatorInsets={{ right: 4 }}
            contentContainerStyle={{ paddingRight: 20 }}
            style={{ marginRight: -20 }}
          />
        </View>
      </View>
    </View>
  );
}

export default SectionsScreen;
