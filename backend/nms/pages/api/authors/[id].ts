import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { Author, ResponseData } from "../types/types";

/**
 * API endpoint for managing a specific author
 * GET: Retrieve author details
 * PUT: Update author details
 * DELETE: Remove an author
 */
export default async function handleAuthor(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Author>
) {
  try {
    const { id } = req.query;
    const authorId = parseInt(id as string, 10);

    if (isNaN(authorId)) {
      return res.status(400).json({ message: "Invalid author ID." });
    }

    // Check if author exists
    const author = await db("authors").where({ id: authorId }).first();
    if (!author) {
      return res.status(404).json({ message: "Author not found." });
    }

    if (req.method === "GET") {
      // Return author details
      return res.status(200).json(author);
    } else if (req.method === "PUT") {
      // Update author details
      let data: any;
      if (typeof req.body === "string") {
        data = JSON.parse(req.body);
      } else {
        data = req.body;
      }

      const { name, slug } = data;

      // Validate required fields
      if (!name && !slug) {
        return res.status(400).json({ message: "At least one field (name or slug) is required." });
      }

      // If changing slug, check if it's already taken
      if (slug && slug !== author.slug) {
        const existingAuthor = await db("authors").where({ slug }).first();
        if (existingAuthor) {
          return res.status(409).json({
            message: `Author with slug '${slug}' already exists.`,
          });
        }
      }

      // Update the author
      const updateData: any = {};
      if (name) updateData.name = name;
      if (slug) updateData.slug = slug;

      await db("authors").where({ id: authorId }).update(updateData);

      // Get updated author
      const updatedAuthor = await db("authors").where({ id: authorId }).first();

      return res.status(200).json({ message: "Author updated successfully", ...updatedAuthor });
    } else if (req.method === "DELETE") {
      // Delete the author
      await db("authors").where({ id: authorId }).del();
      return res.status(200).json({ message: "Author deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling author:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}