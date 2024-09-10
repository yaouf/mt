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

import { createUser } from "./auth/createUser";
import { createDevice } from "./url/createDevice";
import { updateNotificationStatus } from "./url/updateNotificationStatus";
import { updateSettings } from "./url/updateSettings";
import { viewSettings } from "./url/viewSettings";
export { createDevice, createUser, updateNotificationStatus, updateSettings, viewSettings };

