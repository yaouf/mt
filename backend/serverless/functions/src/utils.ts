import { Response } from 'firebase-functions/v1';
import { Request } from 'firebase-functions/v2/https';
import tsscmp from 'tsscmp';
import { validate, version } from 'uuid';
import envars from './envars';


 /**
   * Helper function to validate UUID v4
   * @param id 
   * @returns 
   */
 export function validateUuidV4(uuid: string): boolean {
    return validate(uuid) && version(uuid) === 4;
  }

export function validateApiKey(request: Request, response: Response): boolean {
    // Get the apiKey from the request headers
    const untrustedApiKey = request.get("X-API-KEY");
    if (!untrustedApiKey) {
      response.status(400).send("No API key provided");
      return false;
    }
  
    // Check if the API key is correct
    if (!tsscmp(untrustedApiKey, envars.trustedApiKey)) {
      response.status(401).send("Unauthorized");
      return false;
    }
    return true;
  }