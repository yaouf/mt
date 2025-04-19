import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import BottomActionBar from 'src/components/common/BottomActionBar';
import { ArticleDetailProps } from 'src/types/other';
import { handleBookmark } from 'src/utils/helpers';
import { SavedContext } from '../MainTabNavigator';
import { shareArticle } from './ShareArticle';

/**
 * action bar at the bottom of each article
 * share, save, (notifications for this section / author in a future version)
 */
function BottomArticleBar(props: ArticleDetailProps) {
  const { savedArticles, setSavedArticles } = useContext(SavedContext);
  const [saved, setSaved] = useState<boolean>(savedArticles && typeof savedArticles === 'object' && props.uuid in savedArticles);

  useEffect(() => {
    if (savedArticles && typeof savedArticles === 'object') {
      setSaved(props.uuid in savedArticles);
    }
  }, [savedArticles, props.uuid]);

  function handleShare() {
    const split = props.published_at.split('-');
    shareArticle(`https://www.browndailyherald.com/article/${split[0]}/${split[1]}/${props.slug}`);
  }

  const bookmarkButton = (
    <TouchableOpacity
      style={{ paddingRight: 10 }}
      onPress={() => {
        Haptics.selectionAsync();
        const articlesToUse = savedArticles && typeof savedArticles === 'object' ? savedArticles : {};
        handleBookmark(
          saved,
          props.slug,
          props.published_at,
          props.uuid,
          articlesToUse,
          setSavedArticles,
          setSaved
        );
      }}
      accessible={true}
      accessibilityLabel="Bookmark Button"
      accessibilityHint="Press to bookmark or unbookmark the article"
    >
      {saved ? (
        <Ionicons name="bookmark" size={26} color="#1C1B1F" />
      ) : (
        <Ionicons name="bookmark-outline" size={26} color="#1C1B1F" />
      )}
    </TouchableOpacity>
  );

  return <BottomActionBar onShare={handleShare} rightButtons={bookmarkButton} />;
}

export default BottomArticleBar;
