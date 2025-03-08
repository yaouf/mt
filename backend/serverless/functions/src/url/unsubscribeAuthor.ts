import { Request, Response } from "express";
import db from "../../../db/dist/data/db-config";

/**
 * Unsubscribe a device from an author to stop receiving notifications.
 * 
 * @param req - Express request with deviceId and authorId in request body
 * @param res - Express response
 */
export async function unsubscribeAuthorHandler(req: Request, res: Response): Promise<void> {
  // Extract deviceId and authorId from request body
  const { deviceId, authorId } = req.body;

  // Validate required parameters
  if (!deviceId || !authorId) {
    res.status(400).json({
      success: false,
      message: "Both deviceId and authorId are required",
    });
    return;
  }

  try {
    // Check if subscription exists
    const existingSubscription = await db("device_author_subscriptions")
      .where({
        deviceId,
        authorId,
      })
      .first();

    if (!existingSubscription) {
      res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
      return;
    }

    // Delete the subscription
    await db("device_author_subscriptions")
      .where({
        deviceId,
        authorId,
      })
      .delete();

    res.status(200).json({
      success: true,
      message: "Unsubscribed from author successfully",
    });
  } catch (error) {
    console.error("Error unsubscribing from author:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}