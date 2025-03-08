import { Request, Response } from "express";
import db from "../../../db/dist/data/db-config";

/**
 * Subscribe a device to an author to receive notifications.
 *
 * @param req - Express request with deviceId and authorId in request body
 * @param res - Express response
 */
export async function subscribeAuthorHandler(
  req: Request,
  res: Response
): Promise<void> {
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
    // Check if device exists
    const device = await db("devices").where({ id: deviceId }).first();
    if (!device) {
      res.status(404).json({
        success: false,
        message: "Device not found",
      });
      return;
    }

    // Check if author exists
    const author = await db("authors").where({ id: authorId }).first();
    if (!author) {
      res.status(404).json({
        success: false,
        message: "Author not found",
      });
      return;
    }

    // Check if subscription already exists
    const existingSubscription = await db("device_author_subscriptions")
      .where({
        deviceId,
        authorId,
      })
      .first();

    if (existingSubscription) {
      res.status(409).json({
        success: false,
        message: "Subscription already exists",
        subscription: existingSubscription,
      });
      return;
    }

    // Create new subscription
    const [subscriptionId] = await db("device_author_subscriptions").insert(
      {
        deviceId,
        authorId,
        dateCreated: new Date().toISOString(),
      },
      ["id"]
    );

    // Get the created subscription
    const subscription = await db("device_author_subscriptions")
      .where({ id: subscriptionId })
      .first();

    res.status(201).json({
      success: true,
      message: "Subscribed to author successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error subscribing to author:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
