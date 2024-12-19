// types for data fetched from the api for articles, authors, etc

export interface EditorsPick {
  url: string;
  rank: number;
}

export interface EditorsPickArticle extends Article {
  rank: number;
}

export interface Article {
  id: string;
  headline: string;
  subhead: string;
  uuid: string;
  slug: string;
  content: string;
  published_at: string;
  tags: Tag[];
  authors: Author[];
  dominantMedia: Media;
}

interface AuthorMetadata {
  id: string;
  label: string;
  value: string;
}

export interface Author {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  bio: string;
  tagline: string;
  metadata: AuthorMetadata[];
  ceo_id: string;
}

export interface Media {
  id: string;
  uuid: string;
  attachment_uuid: string;
  base_name: string;
  extension: string;
  preview_extension: string;
  title: string;
  content: string;
  type: string;
  published_at: string;
  ceo_id: string;
  authors: Author[];
}

export interface Tag {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  ceo_id: string;
}
