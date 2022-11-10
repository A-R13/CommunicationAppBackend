import { getData, setData } from './dataStore';

import {
  userType, userShort, message, dmType, getUId, getToken, getChannel, getDm,
  userConvert, CheckValidMessageDms, CheckValidMessageChannels, CheckMessageUser
} from './other';

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function dmCreateV1 (token: string, uIds: number[]): {dmId: number} | {error: string} {
  const data = getData();

  const user: userType = getToken(token);

  let uIdArray;

  uIdArray = uIds.filter(uIds => getUId(uIds) !== undefined);

  if (JSON.stringify(uIdArray) !== JSON.stringify(uIds)) {
    return { error: 'A uId in the input is not valid' };
  }

  const uIdset = Array.from(new Set(uIdArray));

  if (uIdset.length !== uIds.length) {
    return { error: "There are duplicate uId's in the input uIds" };
  }

  if (user === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  const length = data.dms.length;

  uIdArray = uIdArray.map(uId => getUId(uId));

  uIdArray.unshift(user);

  const ownersArray: userShort[] = [];

  const convertedUser: userShort = userConvert(user);

  ownersArray.push(convertedUser);

  const nameArray = uIdArray.map(user => user.userHandle).sort();
  const nameString = nameArray.join(', ');

  const membersArray = uIdArray.map(user => userConvert(user));

  const dm: dmType = {
    name: nameString,
    dmId: length,
    members: membersArray,
    owners: ownersArray,
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

/**
 * <Description: Edits a message on a given channel or Dm>
 * @param {string} token - Unique token of the 'authorising' user
 * @param {number} messageId - Unique ID for a message
 * @returns {}
 */

export function messageEditV1(token: string, messageId: number, message: string): Record<string, never> | {error: string} {
  const data = getData();
  const userToken = getToken(token);

  // checks if token is valid
  if (userToken === undefined || message.length > 1000) {
    return { error: 'Token Is invalid or the message length is > 1000' };
  }

  // check if valid messages

  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  if (channelIndex === -1 && DmIndex === -1) {
    return {
      error: 'Message doenst exist in both Dms and Channel'
    };
  }

  // checks if it is owner and same user
  if (CheckMessageUser(userToken.authUserId, messageId) === false) {
    return {
      error: 'User is not an owner and the original sender'
    };
  }

  // In dms
  if (channelIndex === -1) {
    const DmMessageIndex = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);
    if (message === '') {
      data.dms[DmIndex].messages.splice(DmMessageIndex, 1);
    } else {
      data.dms[DmIndex].messages[DmMessageIndex].message = message;
    }
  } else {
    const channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);
    if (message === '') {
      data.channels[channelIndex].messages.splice(channelMessageIndex, 1);
    } else {
      data.channels[channelIndex].messages[channelMessageIndex].message = message;
    }
  }

  setData(data);
  return {};
}

/**
 * <description:  Removes a dm when given a dmId >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number} dmId - an Id used to identify a dm channel
 *
 * @returns {} - nothing
 */

export function dmRemoveV1(token : string, dmId: number) {
  const data = getData();

  const user = getToken(token);
  const dm = getDm(dmId);

  // checks if token is valid
  if (user === undefined) {
    return { error: 'Token is invalid' };
  }
  // dm doesnt exist
  if (dm === undefined) {
    return {
      error: 'dm doesnt exist'
    };
  }

  const userIdentity = user.authUserId;
  // finds auth user id if token is valid

  const convertedUser: userShort = userConvert(user);
  const owner: userShort = dm.owners.find(member => member.uId === userIdentity);

  // checks if the user is an owner.
  if (JSON.stringify(owner) !== JSON.stringify(convertedUser)) {
    return {
      error: 'User isnt an owner'
    };
  }

  // deletes the dm
  for (const i in data.dms) {
    if (data.dms[i].dmId === dmId) {
      data.dms.splice(parseInt(i), 1);
    }
  }

  setData(data);
  return {};
}

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
/**
 * <Description: Given a valid DmId by a member thats within the dm, this function will return the name and members of that Dm.

 * @param {string} token
 * @param {number} dmId
 *
 * @returns { name: string, members: [users]}
 */

export function dmDetailsV1 (token: string, dmId: number): {name: string, members: userShort[]} | { error: string} {
  // check if token and dmId are valid
  const checkToken = getToken(token);
  const checkDM: dmType = getDm(dmId);

  if (checkToken === undefined) {
    return { error: 'Invalid Token.' };
  }
  if (checkDM === undefined) {
    return { error: 'Invalid DmId' };
  }
  // check if user is a member of the Dm
  const userInDm = checkDM.members.find((a: userShort) => a.uId === checkToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: 'User is not a member of this dm' };
  }

  return {
    name: checkDM.name,
    members: checkDM.members,
  };
}

/**
 * <description: The function provides a list of all the dms the authorised user is part of>

 * @param {string} token
 *
 * @returns { dms: dmType[] } dms
 */

export function dmListV1 (token: string): { dms: { dmId: number, name: string }[] } | { error: string } {
  const user = getToken(token);
  const data = getData();
  const dmArray = data.dms;

  if (user === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  let dmList: { dmId: number, name: string }[] = [];

  const listArray = dmArray.filter((a: dmType) => a.members.some(element => element.uId === user.authUserId));
  //  Iterates through dms, and pushes onto listArray whenever the dm.members has a user with specified user.authUserId

  dmList = listArray.map(dm => { return { dmId: dm.dmId, name: dm.name }; });

  return { dms: dmList };
}

export function messageSendDmV1 (token: string, dmId: number, message: string): {messageId: number} | {error: string} {
  const data = getData();
  const checkToken = getToken(token);
  const checkDM: dmType = getDm(dmId);

  if (checkToken === undefined) {
    return { error: 'Invalid Token.' };
  }
  if (checkDM === undefined) {
    return { error: 'Invalid DmId' };
  }

  if (message.length < 1 || message.length > 1000) {
    return { error: 'Invalid Message length' };
  }
  // check if user is a member of the Dm
  const userInDm = checkDM.members.find((a: userShort) => a.uId === checkToken.authUserId);
  if (userInDm === undefined) {
    return { error: 'User is not a member of this dm' };
  }

  const messageid = Math.floor(Math.random() * 10000);

  for (const dm of data.dms) {
    if (dm.dmId === checkDM.dmId) {
      dm.messages.push({
        messageId: messageid,
        uId: checkToken.authUserId,
        message: message,
        timeSent: Math.floor(Date.now() / 1000),
      });
      break;
    }
  }

  setData(data);

  return { messageId: messageid };
}

/**
 * <description: The function removes the user as a member of the given DM >

 * @param {string} token
 * @param {number} dmId
 *
 * @returns {}
 */

export function dmLeaveV1 (token: string, dmId: number) {
  const data = getData();
  const userToken = getToken(token);
  const checkInDm: dmType = getDm(dmId);
  // invalid token
  if (userToken === undefined) {
    return { error: `Inputted token '${token}' is invalid` };
  }
  // nvalid dmID
  if (checkInDm === undefined) {
    return { error: 'Dm ID not found' };
  }

  const userId = userToken.authUserId;

  const userInDm = checkInDm.members.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInDm === undefined) {
    return { error: 'Inputted user is not a member of this DM' };
  } else {
    data.dms[dmId].owners = data.dms[dmId].owners.filter(m => m.uId !== userId);
    data.dms[dmId].members = data.dms[dmId].members.filter(m => m.uId !== userId);
  }

  return {};
}

/**
 * <Description: Removes a message from a channel or Dm>

 * @param {string} token - Unique token of an authorised user
 * @param {number} messageId - Unique ID for a message

 * @returns {}
 */

export function messageRemoveV1 (token: string, messageId: number) {
  const data = getData();
  const userToken = getToken(token);

  // checks if token is valid
  if (userToken === undefined) {
    return { error: 'Token is invalid' };
  }

  // check if valid messages

  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  if (channelIndex === -1 && DmIndex === -1) {
    return { error: 'Channel/Dm is invalid' };
  }

  // checks if it is owner and same user
  if (CheckMessageUser(userToken.authUserId, messageId) === false) {
    return {
      error: 'User is not an owner or user is not the creator of the message'
    };
  }

  // In dms
  if (channelIndex === -1) {
    const DmMessageIndex = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);
    data.dms[DmIndex].messages.splice(DmMessageIndex, 1);
  } else {
    const channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);
    data.channels[channelIndex].messages.splice(channelMessageIndex, 1);
  }

  setData(data);
  return {};
}


export function messageUnpin(token: string, messageId: any) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);
  const channelIndex = CheckValidMessageChannels(messageId);
  const dmIndex = CheckValidMessageDms(messageId)

  // Invalid token
  if (userToken === undefined) {
    throw HTTPError(403, 'Error: Token is invalid');
  }

  if (checkIsPinned(messageId) === false) {
    throw HTTPError(400, 'Error: Message is already unpinned');
  }

  if (channelIndex === -1 && dmIndex === -1) {
    throw HTTPError(400, 'Error: MessageId doesnt exist!');
  } else if (channelIndex === -1 && dmIndex !== -1) {
    if (!data.dms[dmIndex].members.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the Dm')
    } else if (!data.dms[dmIndex].owners.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in channels');
    }
  } else if (channelIndex !== -1 && dmIndex === -1) {
    if (!data.channels[channelIndex].allMembers.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the channel')
    } else if (!data.channels[channelIndex].ownerMembers.find(x => x.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in dms');
    }
  }

  if (channelIndex === -1) {
     const dmMessageIndex = data.dms[dmIndex].messages.findIndex(message => message.messageId === messageId);
     data.dms[dmIndex].messages[dmMessageIndex].isPinned = false;
  }
  else {
    const channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);
    data.channels[channelIndex].messages[channelMessageIndex].isPinned = false;
  }

  setData(data);
  return {};



}