import { useEffect, useState } from "react";
import { fetchAuthor } from "src/api/fetchContent";
import BottomActionBar from "src/components/common/BottomActionBar";
import { Author } from "src/types/data";
import { StaffDetailProps } from "src/types/other";
import { shareArticle } from "../article/ShareArticle";

/**
 * action bar at the bottom of the staff page
 * go back, share, notifications for this author
 */
function BottomStaffBar(props: StaffDetailProps) {
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    // Fetch author data
    const loadAuthor = async () => {
      try {
        await fetchAuthor(
          props.slug,
          (author) => setAuthor(author || null),
          () => {},
          () => {},
          () => {}
        );
      } catch (error) {
        console.error("Error loading author:", error);
      }
    };
    
    loadAuthor();
  }, [props.slug]);

  function handleShare() {
    shareArticle(`https://www.browndailyherald.com/staff/${props.slug}`);
  }

  return <BottomActionBar onShare={handleShare} />;
}

export default BottomStaffBar;
