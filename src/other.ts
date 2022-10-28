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

export function CheckMessageUser(authUserId : number, messageId : number) : boolean {
  const data = getData();
  const CheckInChannel = CheckValidMessageChannels(messageId);
  if (CheckInChannel === -1) {
    const checkInDm = CheckValidMessageDms(messageId);
    if (checkInDm === -1) {
      // not in channel or dms
      return false;
    } else {
      // in dms
      const DmMessageIndex = data.dms[checkInDm].messages.findIndex(message => message.messageId === messageId);
      // checks if the user is the same
      if (data.dms[checkInDm].messages[DmMessageIndex].uId === authUserId) {
        return true;
      } else {
        // if not the same, check if user is owner
        if (data.dms[checkInDm].owners.find(member => member.uId === authUserId)) {
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    // Message is in channel
    const ChannelMessageIndex = data.channels[CheckInChannel].messages.findIndex(message => message.messageId === messageId);
    // Is the same user
    if (data.channels[CheckInChannel].messages[ChannelMessageIndex].uId === authUserId) {
      return true;
    } else {
    // check if user is member
      for (const member of data.channels[CheckInChannel].ownerMembers) {
        if (member.uId === authUserId) {
          return true;
        }
      }
      return false;
    }
  }
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