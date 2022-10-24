import { getData, setData } from './dataStore';
import { dmType, getUId, getToken, getChannel, clearV1 } from './other';

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

export function messageEditV1(token: string, messageId: number, message: string): {} | {error: string} {
  const data = getData();
  const userToken = getToken(token);
  let validMessage = false;
  let sameUser = false;
  let Isowner = false;
  let messageIndex;

  // checks if token is valid
  if (userToken === undefined || message.length > 1000) {
    return { error: 'error' };
  }

  let userIdentity;
  // finds auth user id if token is valid
  for (const i in data.users) {
    if (data.users[i].sessions.includes(token) === true) {
      userIdentity = data.users[i].authUserId;
    } 
  }

  // checks for dms

  for (const m in data.dms) {
    // checks if valid message
    if (data.dms[m].messages.find(message => message.messageId === messageId)) {
      validMessage = true;

      if (data.dms[m].members[0].uId === userIdentity) {
        Isowner = true;
      } 

      for (const k in data.dms[m].messages) {
        // finds messageIndex
        if (data.dms[m].messages[k].messageId === messageId) {
          // checks if the user is the same one in channel
          if (data.dms[m].messages[k].uId === userIdentity) {
            sameUser = true;
          }
          if (sameUser === true || (sameUser === false && Isowner === true)) {
              // if message is empty, delete message
              if (message === '') {
                data.dms[m].messages.splice(parseInt(k), 1);
              } else {
                data.dms[m].messages[k] = {
                  messageId: messageId,
                  uId: data.dms[m].messages[k].uId,
                  message: message,
                  timeSent: Math.floor(Date.now() / 1000),
                }
              }
          } 

        }
      } 

    }

  }
  
  
  // checks for channels
  for (const i in data.channels) {

      // Checks if valid messageId in channel
      if (data.channels[i].messages.find(message => message.messageId === messageId)) {
        validMessage = true;
        let channel = i;
  
        // checks if user is owner member in channel
        if (data.channels[channel].ownerMembers.find(member => member.uId === userIdentity)) {
          Isowner = true;
        }

      for (const k in data.channels[channel].messages) {
        // finds messageIndex
        if (data.channels[channel].messages[k].messageId === messageId) {
          // checks if the user is the same one in channel
          if (data.channels[channel].messages[k].uId === userIdentity) {
            sameUser = true;
          }

          if (sameUser === true || (sameUser === false && Isowner === true)) {
              // if message is empty, delete message
              if (message === '') {
                data.channels[channel].messages.splice(parseInt(k), 1);
              } else {
                data.channels[channel].messages[k] = {
                  messageId: messageId,
                  uId: data.channels[channel].messages[k].uId,
                  message: message,
                  timeSent: Math.floor(Date.now() / 1000),
                }
              }
          } 

        }
      } 

      }

  }

  if (validMessage === false || (sameUser === false && Isowner === false)) {
    return {
      error: 'error'
    }
  } else {
    
    setData(data);
    return {};
  }


}

import { authRegisterV2, authLoginV2 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2, channelleaveV1 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { userProfileV2 } from './users';

clearV1();
let data = getData();

/*

authRegisterV2('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1
// user2 =
authRegisterV2('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 2
// user3 =
authRegisterV2('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 3

channelsCreateV2(data.users[0].sessions[0], 'Channel1', true);

messageSendV1(data.users[0].sessions[0], 0, 'Test Message 1')
messageSendV1(data.users[0].sessions[0], 0, 'Test Message 2')
messageSendV1(data.users[0].sessions[0], 0, 'Test Message 3')
console.log(data.channels[0].messages)

console.log(messageEditV1(data.users[0].sessions[0], data.channels[0].messages[1].messageId, "HELLO"));

console.log(data.channels[0].messages)


console.log(messageEditV1(data.users[1].sessions[0], data.channels[0].messages[1].messageId, "SECOND EDIT")); */