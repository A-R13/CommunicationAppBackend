import { setData } from './dataStore';

const cleared_data = {    // Should be the same as the intial data object in dataStore.js
  'users': [],
  'channels': []
};  

export function clearV1 () {
    setData(cleared_data);
}
