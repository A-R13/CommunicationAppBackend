<<<<<<< HEAD
import { getData, setData } from './dataStore';
import { port, url } from './config.json';

import request, { HttpVerb } from 'sync-request';
const SERVER_URL = `${url}:${port}`;

// Exported types

export interface userType {
  authUserId: number,
  userHandle: string,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  sessions: string[],
}

export interface userShort {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
}

export interface message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
}

export interface channelType {
  channelId: number,
  channelName: string,
  isPublic: boolean,
  ownerMembers: userShort[],
  allMembers: userShort[],
  messages: message[],
}

export interface channelShort {
  channelId: number,
  name: string,
}

export interface dmType {
  name: string,
  dmId: number,
  members: userShort[],
  messages: message[]
}

export interface dataa {
  users: userType[],
  channels: channelType[],
  dms: dmType[],
}

export interface newUser {
  token: string,
  authUserId: number
}

export interface newChannel {
  channelId: number
}

export interface newDm {
  dmId: number
}

/**
 * <description: Resets the dataStore to its intial state. 'Clearing' away any additional added objects. >
 * @param {} - None
 *
 * @returns {} - None
 */

export function clearV1 () {
  const clearedData: dataa = {
    users: [],
    channels: [],
    dms: [],
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

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {string} token
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getDm(dmId: number) {
  const data = getData();
  return data.dms.find(d => d.dmId === dmId);
}

export function getAuthUserIdFromToken(token: string) {
  const data = getData();

  let userIdentity;
  // finds auth user id if token is valid
  for (const i in data.users) {
    if (data.users[i].sessions.includes(token) === true) {
      userIdentity = data.users[i].authUserId;
    }
  }
  return userIdentity;
}

export function CheckValidMessageDms(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.dms) {
    // checks if valid message
    if (data.dms[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
}

export function CheckValidMessageChannels(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.channels) {
    // checks if valid message
    if (data.channels[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
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
=======
import { getData, setData } from './dataStore';
import { port, url } from './config.json';

import request, { HttpVerb } from 'sync-request';
const SERVER_URL = `${url}:${port}`;

// Exported types

export interface userType {
  authUserId: number,
  userHandle: string,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  sessions: string[],
}

export interface userShort {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
}

export interface message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
}

export interface channelType {
  channelId: number,
  channelName: string,
  isPublic: boolean,
  ownerMembers: userShort[],
  allMembers: userShort[],
  messages: message[],
}

export interface channelShort {
  channelId: number,
  name: string,
}

export interface dmType {
  name: string,
  dmId: number,
  members: userShort[],
  owners: userShort[],
  messages: message[]
}

export interface dataa {
  users: userType[],
  channels: channelType[],
  dms: dmType[],
}

export interface newUser {
  token: string,
  authUserId: number
}

export interface newChannel {
  channelId: number
}

export interface newDm {
  dmId: number
}

/**
 * <description: Resets the dataStore to its intial state. 'Clearing' away any additional added objects. >
 * @param {} - None
 *
 * @returns {} - None
 */

export function clearV1 () {
  const clearedData: dataa = {
    users: [],
    channels: [],
    dms: [],
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

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {string} token
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getDm(dmId: number) {
  const data = getData();
  return data.dms.find(d => d.dmId === dmId);
}

export function userConvert(user: userType): userShort {
  return {
    uId: user.authUserId,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    handleStr: user.userHandle
  };
}

export function CheckValidMessageDms(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.dms) {
    // checks if valid message
    if (data.dms[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
}

export function CheckValidMessageChannels(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.channels) {
    // checks if valid message
    if (data.channels[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
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
>>>>>>> master
