import { getData, setData } from './dataStore';
import { port, url } from './config.json';

import request, { HttpVerb } from 'sync-request';
const SERVER_URL = `${url}:${port}`;

/**
 * <description: Resets the dataStore to its intial state. 'Clearing' away any additional added objects. >
 * @param {} - None
 *
 * @returns {} - None
 */

export function clearV1 () {
  const clearedData = {
    users: [],
    channels: [],
    dms: []
  };
  setData(clearedData);

  return {};
}

/**
 * <Description: Returns the object in channels array which corresponds with inputed channelId. >
 * @param {number} channelId
 * @returns { channel: { channelId, channelName, isPublic, ownerMembers:
 * [{ uId, email, nameFirst, nameLast, handleStr}],
 * allMembers: [{uId, email, nameFirst, nameLast, handleStr}], messages } }
 */
export function getChannel(channelId: number) {
  const data = getData();
  return data.channels.find(c => c.channelId === channelId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted authUserId. >
 * @param {number} authUserId
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getAuthUserId(authUserId: number) {
  const data = getData();
  return data.users.find(a => a.authUserId === authUserId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {number} uId
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getUId(uId: number) {
  const data = getData();
  return data.users.find(u => u.authUserId === uId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {string} token
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getToken(token: string) {
  const data = getData();
  return data.users.find(a => a.sessions.includes(token) === true);
}

// From wk5 Labs
export function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody('utf-8'));
}

export function requestClear() {
  return requestHelper('DELETE', '/clear/v1', {});
}
