// for horz menu
export interface MenuItem {
  id: number;
  title: string;
  slug: string;
}

// for bottom bar and share context menu
export type ArticleDetailProps = {
  published_at: string;
  slug: string;
  uuid: string;
  large?: boolean;
};
