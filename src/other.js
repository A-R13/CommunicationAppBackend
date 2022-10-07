import { getData, setData } from './dataStore.js';

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

//helper function
export function getChannel(channelId) {
  const data = getData();
  return data.channels.find(c => c.channelId === channelId);
}

export function getAuthUserId(authUserId) {
  const data = getData();
  return data.users.find(a => a.authUserId === authUserId)
}

export function getUId(uId) {
  const data = getData();
  return data.users.find(u => u.authUserId === uId);
}

