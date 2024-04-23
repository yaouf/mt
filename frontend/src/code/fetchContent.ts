import { Dispatch, SetStateAction } from "react";
import { Article } from "src/types/types";

// TODO: edit so that section articles aren't included if in top stories

export async function fetchSectionHome(
  section: string,
  limit: number,
  setStories: Dispatch<SetStateAction<Article[] | undefined>>
): Promise<string> {
  try {
    // Fetch a response using the Search.JSON URL Link (Currently restricted to basic searches)
    const response = await fetch(
      `https://www.browndailyherald.com/section/${section}.json?per_page=${limit}&page=1`
    );
    const jsonString = await response.text();
    const resultObject = JSON.parse(jsonString); // Parse string into an object

    const sectionName: string = resultObject.section.title;

    const articleList: Article[] = resultObject.articles; // List of articles

    setStories(articleList);
    return sectionName;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch section ${section}`);
  }
}
