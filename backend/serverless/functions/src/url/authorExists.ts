import { Request, Response } from "express";
import db from "../../../db/dist/data/db-config";

/**
 * Check if an author exists by slug, id, or name.
 * 
 * @param req - Express request with search parameters
 * @param res - Express response
 */
export async function authorExistsHandler(req: Request, res: Response): Promise<void> {
  try {
    // Get query parameters
    const { slug, id, name } = req.query;
    
    // Make sure at least one parameter is provided
    if (!slug && !id && !name) {
      res.status(400).json({
        success: false,
        message: "At least one search parameter (slug, id, or name) is required",
      });
      return;
    }

    // Build the query based on provided parameters
    const query = db("authors").select("id", "name", "slug");
    
    if (slug) {
      query.orWhere({ slug: String(slug) });
    }
    
    if (id) {
      const authorId = parseInt(String(id), 10);
      if (!isNaN(authorId)) {
        query.orWhere({ id: authorId });
      }
    }
    
    if (name) {
      query.orWhereILike("name", `%${String(name)}%`);
    }

    // Execute the query
    const authors = await query;

    // Return the results
    if (authors.length > 0) {
      res.status(200).json({
        success: true,
        exists: true,
        authors: authors,
        message: "Author(s) found",
      });
    } else {
      res.status(200).json({
        success: true,
        exists: false,
        authors: [],
        message: "No authors found matching the criteria",
      });
    }
  } catch (error) {
    console.error("Error checking if author exists:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}