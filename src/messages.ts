import { getData, setData } from './dataStore';

import { userShort, message, dmType, getUId, getToken, getChannel, getDm, 
        getAuthUserIdFromToken, CheckValidMessageDms, CheckValidMessageChannels} from './other';

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
    members: membersArray,
    messages: [],
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
  let sameUser = false;
  let Isowner = false;
  let messageIndex;

  // checks if token is valid
  if (userToken === undefined || message.length > 1000) {
    return { error: 'error' };
  }

  const userIdentity = getAuthUserIdFromToken(token);

  // check if valid messages

  let channelIndex = CheckValidMessageChannels(messageId);
  let DmIndex = CheckValidMessageDms(messageId);
  let dmMessageIndex = 0;
  let channelMessageIndex = 0;

  if (DmIndex === -1 && channelIndex === -1) {
    return {error: 'error'}
  } else if (DmIndex === -1 && channelIndex !== -1 ) {
    // channel exists. 
    channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);
    // check if owner
    if (data.channels[channelIndex].ownerMembers.find(member => member.uId === userIdentity)) {
      Isowner = true;
    }
    // check if same user
    if (data.channels[channelIndex].messages[channelMessageIndex].uId === userIdentity) {
      sameUser = true;
    }

  } else {
    // Dm exists
    dmMessageIndex = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);
    // check if owner
    if (data.dms[DmIndex].members[0].uId === userIdentity) {
      Isowner = true;
    }
    // check if same user
    if (data.dms[DmIndex].messages[dmMessageIndex].uId === userIdentity) {
      sameUser = true;
    }
  }

  if (sameUser === true || (sameUser === false && Isowner === true)) {
      // if message is empty, delete message
      if (message === '') {
        data.channels[channelIndex].messages.splice(channelMessageIndex, 1);
      } else if (DmIndex === -1) {
        data.channels[channelIndex].messages[channelMessageIndex].message = message;
      } else if (channelIndex === -1) {
        data.dms[DmIndex].messages[dmMessageIndex].message = message;
      }
  } 


  if ((sameUser === false && Isowner === false)) {
    return {
      error: 'error'
    }
  } else {
    
    setData(data);
    return {};
  }

}
/*
import { authRegisterV2, authLoginV2 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2, channelleaveV1 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { userProfileV2 } from './users';

let data = getData();



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


console.log(messageEditV1(data.users[0].sessions[0], data.channels[0].messages[2].messageId, "SECOND EDIT")); 
console.log(data.channels[0].messages)
*/

/**
 * <Description: Returns the first 50 messages from a specified dm, given a starting index and given that the accessing user is a member of said dm.
 * If there are less than (start + 50) messages the 'end' value will be -1, to show that there are no more messages to show.

 * @param {string} token
 * @param {number} dmId
 * @param {number} start
 * @returns { messages: [{ messageId, uId, message, timeSent }], start: number, end: number}
 */

export function dmMessagesV1 (token: string, dmId: number, start: number): { messages: message[], start: number, end: number} | { error: string} {
  const userToken = getToken(token);
  const dm: dmType = getDm(dmId);

  if (dm === undefined) {
    // If dm is undefined
    return { error: `dm with dmId '${dmId}' does not exist!` };
  } else if (start > dm.messages.length) {
    // If the provided start is greater than the total messages in the dm, an error will be returned
    return { error: `Start '${start}' is greater than the total number of messages in the specified dm` };
  }

  if (userToken === undefined) {
    // If user doesn't exist at all, return an error
    return { error: `User with token '${token}' does not exist!` };
  }

  const userInDm = dm.members.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: `User with authUserId '${userToken.authUserId}' is not a member of dm with dmId '${dmId}'!` };
  }

  if ((start + 50) > dm.messages.length) {
    // If the end value is more than the messages in the channel, set end to -1, to indicate no more messages can be loaded
    return {
      messages: dm.messages.slice(start, dm.messages.length),
      start: start,
      end: -1,
    };
  } else {
    return {
      // If the end value is less than the messages in the channel, set end to (start + 50) to indicate there are still more messages to be loaded
      messages: dm.messages.slice(start, (start + 50)),
      start: start,
      end: (start + 50),
    };
  }
}
