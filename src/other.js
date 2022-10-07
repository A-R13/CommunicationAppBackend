import { setData } from './dataStore.js';

/**
 * <description: Resets the dataStore to its intial state. 'Clearing' away any additional added objects. >
 * @param {} - None
 * 
 * @returns {} - None
 */

export function clearV1 () {
  const cleared_data = {    
    'users': [],
    'channels': []
  };  
  setData(cleared_data);
}

