/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import { authorExistsHandler } from "./url/authorExists";
import { createDevice } from "./url/createDevice";
import { getDeviceAuthorsHandler } from "./url/getDeviceAuthors";
import { subscribeAuthorHandler } from "./url/subscribeAuthor";
import { unsubscribeAuthorHandler } from "./url/unsubscribeAuthor";
import { updateNotificationStatus } from "./url/updateNotificationStatus";
import { updateSettings } from "./url/updateSettings";
import { viewEditorsPicks } from "./url/viewEditorsPicks";
import { viewSettings } from "./url/viewSettings";

// Export existing functions
export {
  createDevice,
  updateNotificationStatus,
  updateSettings,
  viewEditorsPicks,
  viewSettings,
};

// Export new author-related functions
export const subscribeAuthor = functions.https.onRequest(
  subscribeAuthorHandler
);
export const unsubscribeAuthor = functions.https.onRequest(
  unsubscribeAuthorHandler
);
export const authorExists = functions.https.onRequest(authorExistsHandler);
export const getDeviceAuthors = functions.https.onRequest(
  getDeviceAuthorsHandler
);
