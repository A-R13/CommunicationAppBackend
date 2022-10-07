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


/**
 * <Description: Returns the object in channels array which corresponds with inputed channelId. >
 * @param {number} channelId 
 * @returns { channel: { channelId, channelName, isPublic, ownerMembers: 
 * [{ uId, email, nameFirst, nameLast, handleStr}], 
 * allMembers: [{uId, email, nameFirst, nameLast, handleStr}], messages } }
 */
export function getChannel(channelId) {
  const data = getData();
  return data.channels.find(c => c.channelId === channelId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted authUserId. >
 * @param {number} authUserId 
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getAuthUserId(authUserId) {
  const data = getData();
  return data.users.find(a => a.authUserId === authUserId)
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {number} authUserId 
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getUId(uId) {
  const data = getData();
  return data.users.find(u => u.authUserId === uId);
}

