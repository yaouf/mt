import { Request, Response } from "express";
import db from "../../../db/dist/data/db-config";

/**
 * Get all authors a device is subscribed to.
 *
 * @param req - Express request with deviceId in request body
 * @param res - Express response
 */
export async function getDeviceAuthorsHandler(
  req: Request,
  res: Response
): Promise<void> {
  // Extract deviceId from request body
  const { deviceId } = req.body;

  // Validate required parameters
  if (!deviceId) {
    res.status(400).json({
      success: false,
      message: "DeviceId is required",
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

    // Get all authors the device is subscribed to
    const authors = await db("authors")
      .join(
        "device_author_subscriptions",
        "authors.id",
        "=",
        "device_author_subscriptions.authorId"
      )
      .where("device_author_subscriptions.deviceId", deviceId)
      .select(
        "authors.id",
        "authors.name",
        "authors.slug",
        "authors.dateCreated"
      );

    res.status(200).json({
      success: true,
      authors,
    });
  } catch (error) {
    console.error("Error getting device authors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
