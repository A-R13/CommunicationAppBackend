import { setData } from './dataStore.js';

/**
  * No arguments and no returns, but 'resets' the dataStore data to its intial state.
  * data = {'users': [], 'channels': []}
  * 
*/
export function clearV1 () {
  const cleared_data = {    // Should be the same as the intial data object in dataStore.js
    'users': [],
    'channels': []
  };  
  setData(cleared_data);
}

