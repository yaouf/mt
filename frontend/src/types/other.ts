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
  authorSlug?: string; // Optional author slug for notification subscription
};

// for staff page bottom bar and share context menu
export type StaffDetailProps = {
  slug: string;
};
