import { setData } from './dataStore.js';


export function clearV1 () {
  const cleared_data = {    // Should be the same as the intial data object in dataStore.js
    'users': [],
    'channels': []
  };  
  setData(cleared_data);
}

