import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { Author } from "../types/types";

type ResponseData = {
  message?: string;
  authors?: Author[];
  total?: number;
};

// Helper function to handle the actual API logic
async function handleAuthorsRequest(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      // Get query parameters for pagination and search
      const { search, limit = 100, offset = 0 } = req.query;

      // Build base query builder
      let queryBuilder = db("authors");

      // Apply search filter if provided
      if (search && typeof search === "string") {
        queryBuilder = queryBuilder
          .whereILike("name", `%${search}%`)
          .orWhereILike("slug", `%${search}%`);
      }

      // Create a count query
      const countQuery = db.from("authors").count("* as count").first();

      // Apply the same search conditions to count query if needed
      if (search && typeof search === "string") {
        countQuery
          .whereILike("name", `%${search}%`)
          .orWhereILike("slug", `%${search}%`);
      }

      // Get authors with pagination
      const authorsQuery = queryBuilder
        .select("*")
        .orderBy("name", "asc")
        .limit(Number(limit))
        .offset(Number(offset));

      // Execute queries
      const [authors, countResult] = await Promise.all([
        authorsQuery,
        countQuery,
      ]);

      // Respond with authors list and total count
      res.status(200).json({
        authors,
        total: countResult ? Number(countResult.count) : 0,
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ message: "Failed to fetch authors" });
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
    await authMiddleware(req, res, handleAuthorsRequest);
  });
}
