import { validate, version } from 'uuid';


 /**
   * Helper function to validate UUID v4
   * @param id 
   * @returns 
   */
 function validateUuidV4(uuid: string): boolean {
    return validate(uuid) && version(uuid) === 4;
  }

  export default validateUuidV4;