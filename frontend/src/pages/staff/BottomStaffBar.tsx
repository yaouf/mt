import BottomActionBar from 'src/components/common/BottomActionBar';
import { StaffDetailProps } from 'src/types/other';
import { shareArticle } from '../article/ShareArticle';

/**
 * action bar at the bottom of the staff page
 * go back, share, (notifications for this section / author in a future version)
 */
function BottomStaffBar(props: StaffDetailProps) {
  function handleShare() {
    shareArticle(`https://www.browndailyherald.com/staff/${props.slug}`);
  }

  return <BottomActionBar onShare={handleShare} />;
}

export default BottomStaffBar;
