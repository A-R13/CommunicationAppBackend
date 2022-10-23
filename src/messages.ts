import { getData, setData } from './dataStore';
import { dmType, getUId, getToken, getChannel } from './other';

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function dmCreateV1 (token: string, uIds: number[]): {dmId: number} | {error: string} {
  const data = getData();

  let uIdArray;

  uIdArray = uIds.filter(uIds => getUId(uIds) !== undefined);

  if (JSON.stringify(uIdArray) !== JSON.stringify(uIds)) {
    return { error: 'A uId in the input is not valid' };
  }

  const uIdset = Array.from(new Set(uIdArray));

  if (uIdset.length !== uIds.length) {
    return { error: "There are duplicate uId's in the input uIds" };
  }

  if (getToken(token) === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  const length = data.dms.length;

  uIdArray = uIdArray.map(uId => getUId(uId));
  uIdArray.unshift(getToken(token));

  const nameArray = uIdArray.map(user => user.userHandle).sort();
  const nameString = nameArray.join(', ');

  const membersArray = uIdArray.map(user => {
    return {
      uId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameFirst,
      handleStr: user.userHandle
    };
  });

  const dm: dmType = {
    name: nameString,
    dmId: length,
    members: membersArray
  };

  data.dms.push(dm);

  setData(data);

  return { dmId: length };
}

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function messageSendV1 (token: string, channelId: number, message: string): {messageId: number} | {error: string} {
  let channel = getChannel(channelId);
  const user = getToken(token);

  if (channel === undefined) {
    // If channel is undefined
    return { error: `Channel with channelId '${channel}' does not exist!` };
  } else if (message.length < 1 || message.length > 1000) {
    return { error: 'The message is either too short (< 1) or too long (> 1000).' };
  } else if (user === undefined) {
    // If user doesn't exist at all, return an error
    return { error: `User with token '${token}' does not exist!` };
  }

  const userInChannel = channel.allMembers.find(a => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: `User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channel}'!` };
  }

  const messageid = Math.floor(Math.random() * 10000);

  const msgg = {
    messageId: messageid,
    uId: user.authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
  };

  const data = getData();
  channel = data.channels.find(c => c === channel);
  channel.messages.unshift(msgg);

  setData(data);

  return { messageId: messageid };
}

export function dmRemoveV1(token : string, dmId: number) {
  const data = getData();

  // checks if token is valid
  if (getToken(token) === undefined) {
    return { error: 'error' };
  }  

  if (data.dms.find(a => a.dmId === dmId) === undefined) {
    return {
      error: 'error'
    }
  }

  // add code to error test.

  for (const i in data.dms) {
    if (data.dms[i].dmId === dmId) {
      data.dms.splice(parseInt(i), 1);
      return {};
    }
  }
  
}

const data = getData();

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2, channelleaveV1 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { userProfileV2 } from './users';

/*
let user0 = authRegisterV2('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number}; // uid = 0
let user1 = authRegisterV2('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1
let user2 = authRegisterV2('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 2
let user3 = authRegisterV2('example3@gmail.com', 'ABCD1234', 'joff', 'Doe') as {token: string, authUserId: number}; // uid = 3

dmCreateV1(data.users[0].sessions[0], [1, 2, 3]);
dmCreateV1(data.users[1].sessions[0], [0]);
dmCreateV1(data.users[3].sessions[0], [1]);
dmRemoveV1(data.users[3].sessions[0], 2)
console.log(data.dms)
*/