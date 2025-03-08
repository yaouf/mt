import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { Author } from "../types/types";

type ResponseData = {
  message: string;
  author?: Author;
};

// Helper function to handle the actual API logic
async function handleAddAuthorRequest(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const { name, slug } = req.body;

      // Validation
      if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required" });
      }

      // Normalize the slug
      const normalizedSlug = slug.toLowerCase().trim();

      // Check if author with same slug already exists
      const existingAuthor = await db("authors")
        .where({ slug: normalizedSlug })
        .first();
      if (existingAuthor) {
        return res
          .status(409)
          .json({ message: "An author with this slug already exists" });
      }

      // Insert the new author
      const [authorId] = await db("authors").insert({
        name,
        slug: normalizedSlug,
        dateCreated: new Date().toISOString(),
      });

      // Fetch the created author
      const author = await db("authors").where({ id: authorId }).first();

      res.status(201).json({
        message: "Author created successfully",
        author,
      });
    } catch (error) {
      console.error("Error creating author:", error);
      res.status(500).json({ message: "Failed to create author" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Use CORS middleware with proper callback
  corsMiddleware(req, res, async () => {
    // Use auth middleware with proper callback
    await authMiddleware(req, res, handleAddAuthorRequest);
  });
}
