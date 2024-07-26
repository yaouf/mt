import { Dispatch, SetStateAction } from "react";
import { Article, Author, Media } from "src/types/data";

// TODO: edit so that section articles aren't included if in top stories

export async function fetchSectionHome(
  section: string,
  limit: number
  // setStories: Dispatch<SetStateAction<Article[] | undefined>>
): Promise<Article[]> {
  try {
    const response = await fetch(
      `https://www.browndailyherald.com/section/${section}.json?per_page=${limit}&page=1`
    );
    const jsonString = await response.text();
    const resultObject = JSON.parse(jsonString); // Parse string into an object
    const articleList: Article[] = resultObject.articles; // List of articles

    return articleList;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch section ${section}`);
  }

  // try {
  //   // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
  //   const response = await fetch(
  //     `https://www.browndailyherald.com/section/${section}.json?per_page=${limit}&page=1`
  //   );
  //   const jsonString = await response.text();
  //   const resultObject = JSON.parse(jsonString); // Parse string into an object

  //   const sectionName: string = resultObject.section.title;

  //   const articleList: Article[] = resultObject.articles; // List of articles

  //   setStories(articleList);
  //   return sectionName;
  // } catch (error) {
  //   console.log(error);
  //   throw new Error(`Failed to fetch section ${section}`);
  // }
}

export async function fetchArticle(
  slug: string,
  date: string,
  setArticle: Dispatch<SetStateAction<Article | undefined>>
): Promise<Article> {
  // "published_at": "2024-05-24 22:49:21",
  const split = date.split("-");

  try {
    // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
    const response = await fetch(
      `https://www.browndailyherald.com/article/${split[0]}/${split[1]}/${slug}.json`
    );
    const jsonString = await response.text();
    const resultObject = JSON.parse(jsonString); // Parse string into an object

    const article: Article = resultObject.article;
    setArticle(article);
    return article;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch article ${slug}`);
  }
}

export async function fetchSection(
  section: string,
  page: number,
  setStories: Dispatch<SetStateAction<Article[] | undefined>>
): Promise<Array<string | number>> {
  try {
    // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
    const response = await fetch(
      `https://www.browndailyherald.com/section/${section}.json?page=${page}`
    );
    const jsonString = await response.text();
    const resultObject = JSON.parse(jsonString); // Parse string into an object

    const sectionName: string = resultObject.section.title;
    const lastPage: number = resultObject.pagination.last;

    const articleList: Article[] = resultObject.articles; // List of articles

    setStories(articleList);
    return [sectionName, lastPage];
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch section ${section}`);
  }
}

export async function fetchAuthor(
  slug: string,
  setAuthor: Dispatch<SetStateAction<Author | undefined>>,
  setArticles: Dispatch<SetStateAction<Article[] | undefined>>,
  setMedia: Dispatch<SetStateAction<Media[] | undefined>>,
  setPosts: Dispatch<SetStateAction<string[] | undefined>>
): Promise<string> {
  try {
    // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
    const response = await fetch(
      `https://www.browndailyherald.com/staff/${slug}.json`
    );
    const jsonString = await response.text();
    const resultObject = JSON.parse(jsonString); // Parse string into an object

    const author: Author = resultObject.author;

    const articleList: Article[] = resultObject.articles; // List of articles
    const mediaList: Media[] = resultObject.media;
    const postList: string[] = resultObject.posts; // TODO: does anyone have blog posts - make a type for this but string for now

    setAuthor(author);
    setArticles(articleList);
    setMedia(mediaList);
    setPosts(postList);

    return author.name;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch author ${slug}`);
  }
}
