import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { Author, ResponseData } from "../types/types";

/**
 * API endpoint for managing authors
 * GET: Retrieve all authors
 * POST: Create a new author
 */
export default async function handleAuthors(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Author[] | { authors: Author[] }>
) {
  try {
    if (req.method === "GET") {
      // Get all authors
      const authors = await db("authors")
        .select("id", "name", "slug", "dateCreated")
        .orderBy("name", "asc");

      return res.status(200).json({ authors });
    } else if (req.method === "POST") {
      // Create a new author
      let data: any;
      if (typeof req.body === "string") {
        data = JSON.parse(req.body);
      } else {
        data = req.body;
      }

      const { name, slug } = data;

      // Validate required fields
      if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required." });
      }

      // Check if author with this slug already exists
      const existingAuthor = await db("authors").where({ slug }).first();
      if (existingAuthor) {
        return res.status(409).json({
          message: `Author with slug '${slug}' already exists.`,
        });
      }

      // Insert the new author
      const [authorId] = await db("authors")
        .insert({
          name,
          slug,
          dateCreated: new Date().toISOString(),
        })
        .returning("id");

      const author = await db("authors").where({ id: authorId }).first();

      return res.status(201).json({ message: "Author created successfully" });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling authors:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
