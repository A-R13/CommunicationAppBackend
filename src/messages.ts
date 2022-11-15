import HTTPError from 'http-errors';

import { getData, setData, userType, userShort, message, dmType } from './dataStore';

import {
  getUId, getToken, getChannel, getDm, checkIsPinned, checkIsUnpinned, userReacted, isUserReacted, messageFinder,
  userConvert, CheckValidMessageDms, CheckValidMessageChannels, CheckMessageUser, getHashOf, SECRET
} from './helperFunctions';

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function dmCreateV2 (token: string, uIds: number[]): {dmId: number} | {error: string} {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  let uIdArray;

  uIdArray = uIds.filter(uIds => getUId(uIds) !== undefined);

  if (JSON.stringify(uIdArray) !== JSON.stringify(uIds)) {
    throw HTTPError(400, 'Error: A uId in the input is not valid.');
  }

  const uIdset = Array.from(new Set(uIdArray));

  if (uIdset.length !== uIds.length) {
    throw HTTPError(400, "Error: There are duplicate uId's in the input uIds.");
  }

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does no t exist!`);
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

  for (const i of membersArray) {
    // adds 1 to the number of dms joined
    data.users[i.uId].stats[3].numDmsJoined += 1;

    // pushes some stats about number of dms joined back to user
    data.users[i.uId].stats[1].dmsJoined.push({
      numDmsJoined: data.users[i.uId].stats[3].numDmsJoined,
      timeStamp: Math.floor(Date.now() / 1000)
    });
  }

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

export function messageSendV2 (token: string, channelId: number, message: string): {messageId: number} | {error: string} {
  let channel = getChannel(channelId);

  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  if (channel === undefined) {
    // If channel is undefined
    throw HTTPError(400, `Error: Channel with channelId '${channel}' does not exist!`);
  } else if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Error: The message is either too short (< 1) or too long (> 1000).');
  } else if (user === undefined) {
    // If user doesn't exist at all, return an error
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }

  const userInChannel = channel.allMembers.find(a => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  const messageid = Math.floor(Math.random() * 10000);

  const msgg: message = {
    messageId: messageid,
    uId: user.authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
    reacts: [],
    isPinned: false
  };

  const data = getData();
  channel = data.channels.find(c => c === channel);
  channel.messages.unshift(msgg);

  // adds 1 to the number of messages sent
  data.users[user.authUserId].stats[3].numMessagesSent += 1;

  // pushes some stats about number of messages sent back to user
  data.users[user.authUserId].stats[2].messagesSent.push({
    numMessagesSent: data.users[user.authUserId].stats[3].numMessagesSent,
    timeStamp: Math.floor(Date.now() / 1000)
  });

  setData(data);

  return { messageId: messageid };
}

/**
 * <Description: Edits a message on a given channel or Dm>
 * @param {string} token - Unique token of the 'authorising' user
 * @param {number} messageId - Unique ID for a message
 * @returns {}
 */

export function messageEditV2(token: string, messageId: number, message: string): Record<string, never> | {error: string} {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);

  // checks if token is valid
  if (userToken === undefined) {
    throw HTTPError(403, 'Error: token is invalid');
  }

  if (message.length > 1000) {
    throw HTTPError(400, 'Error: Message length cannot be greater than 1000 characters');
  }

  // check if valid messages

  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  if (channelIndex === -1 && DmIndex === -1) {
    throw HTTPError(400, 'Error: MessageId doesnt exist!');
  }

  // checks if it is owner and same user
  if (CheckMessageUser(userToken.authUserId, messageId) === false) {
    throw HTTPError(403, 'Error: Not the same user and not an owner!');
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

export function dmRemoveV2(token : string, dmId: number) {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  const dm = getDm(dmId);

  // checks if token is valid
  if (user === undefined) {
    throw HTTPError(403, 'Error: Token doesnt exist');
  }
  // dm doesnt exist
  if (dm === undefined) {
    throw HTTPError(400, 'Error: Dm doesnt exist');
  }

  const userIdentity = user.authUserId;
  // finds auth user id if token is valid

  const convertedUser: userShort = userConvert(user);
  const owner: userShort = dm.owners.find(member => member.uId === userIdentity);

  // checks if the user is an owner.
  if (JSON.stringify(owner) !== JSON.stringify(convertedUser)) {
    throw HTTPError(403, 'Error: Not an owner');
  }

  for (const i of data.dms[dmId].members) {
    // adds 1 to the number of messages sent
    data.users[i.uId].stats[3].numDmsJoined -= 1;

    // pushes some stats about number of dms joined sent back to user
    data.users[i.uId].stats[1].dmsJoined.push({
      numDmsJoined: data.users[i.uId].stats[3].numDmsJoined,
      timeStamp: Math.floor(Date.now() / 1000)
    });
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

export function dmMessagesV2 (token: string, dmId: number, start: number): { messages: message[], start: number, end: number} | { error: string} {
  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);

  const dm: dmType = getDm(dmId);

  if (dm === undefined) {
    // If dm is undefined
    throw HTTPError(400, `Error: Dm with dmId '${dmId}' does not exist!`);
  } else if (start > dm.messages.length) {
    // If the provided start is greater than the total messages in the dm, an error will be returned
    throw HTTPError(400, `Error: Start '${start}' is greater than the total number of messages in the specified channel`);
  }

  if (userToken === undefined) {
    // If user doesn't exist at all, return an error
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }

  const userInDm = dm.members.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${userToken.authUserId}' is not a member of dm with dmId '${dmId}'!`);
  }

  if ((start + 50) > dm.messages.length) {
    // If the end value is more than the messages in the channel, set end to -1, to indicate no more messages can be loaded
    return {
      messages: dm.messages.slice(0, dm.messages.length),
      start: start,
      end: -1,
    };
  } else {
    return {
      // If the end value is less than the messages in the channel, set end to (start + 50) to indicate there are still more messages to be loaded
      messages: dm.messages.slice(0, (start + 50)),
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

export function dmDetailsV2 (token: string, dmId: number): {name: string, members: userShort[]} | { error: string} {
  // check if token and dmId are valid
  const tokenHashed = getHashOf(token + SECRET);
  const checkToken = getToken(tokenHashed);

  const checkDM: dmType = getDm(dmId);

  if (checkToken === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }
  if (checkDM === undefined) {
    throw HTTPError(400, 'Error: Invalid DmId');
  }
  // check if user is a member of the Dm
  const userInDm = checkDM.members.find((a: userShort) => a.uId === checkToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, 'Error: User is not a member of the Dm');
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

export function dmListV2 (token: string): { dms: { dmId: number, name: string }[] } | { error: string } {
  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  const data = getData();
  const dmArray = data.dms;

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }

  let dmList: { dmId: number, name: string }[] = [];

  const listArray = dmArray.filter((a: dmType) => a.members.some(element => element.uId === user.authUserId));
  //  Iterates through dms, and pushes onto listArray whenever the dm.members has a user with specified user.authUserId

  dmList = listArray.map(dm => { return { dmId: dm.dmId, name: dm.name }; });

  return { dms: dmList };
}

export function messageSendDmV2 (token: string, dmId: number, message: string): {messageId: number} | {error: string} {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const checkToken = getToken(tokenHashed);

  const checkDM: dmType = getDm(dmId);

  if (checkToken === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }
  if (checkDM === undefined) {
    throw HTTPError(400, 'Error: Invalid DmId');
  }

  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Error: Invalid Message Length');
  }
  // check if user is a member of the Dm
  const userInDm = checkDM.members.find((a: userShort) => a.uId === checkToken.authUserId);
  if (userInDm === undefined) {
    throw HTTPError(403, 'Error: User is not a member of Dm');
  }

  const messageid = Math.floor(Math.random() * 10000);

  for (const dm of data.dms) {
    if (dm.dmId === checkDM.dmId) {
      dm.messages.unshift({
        messageId: messageid,
        uId: checkToken.authUserId,
        message: message,
        timeSent: Math.floor(Date.now() / 1000),
        reacts: [],
        isPinned: false
      });
      break;
    }
  }

  // adds 1 to the number of messages sent
  data.users[checkToken.authUserId].stats[3].numMessagesSent += 1;

  // pushes some stats about number of messages sent back to user
  data.users[checkToken.authUserId].stats[2].messagesSent.push({
    numMessagesSent: data.users[checkToken.authUserId].stats[3].numMessagesSent,
    timeStamp: Math.floor(Date.now() / 1000)
  });

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

export function dmLeaveV2 (token: string, dmId: number) {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);

  const checkInDm: dmType = getDm(dmId);
  // invalid token
  if (userToken === undefined) {
    throw HTTPError(403, 'Error: User token does not exist!');
  }
  // Invalid dmID
  if (checkInDm === undefined) {
    throw HTTPError(400, 'Error: DmId is not valid!');
  }

  const userId = userToken.authUserId;

  const userInDm = checkInDm.members.find((a: userShort) => a.uId === userToken.authUserId);

  if (userInDm === undefined) {
    throw HTTPError(403, 'Error: User is not a member of the dm');
  } else {
    data.dms[dmId].owners = data.dms[dmId].owners.filter(m => m.uId !== userId);
    data.dms[dmId].members = data.dms[dmId].members.filter(m => m.uId !== userId);
  }

  // adds 1 to the number of messages sent
  data.users[userToken.authUserId].stats[3].numDmsJoined -= 1;

  // pushes some stats about number of dms joined sent back to user
  data.users[userToken.authUserId].stats[1].dmsJoined.push({
    numDmsJoined: data.users[userToken.authUserId].stats[3].numDmsJoined,
    timeStamp: Math.floor(Date.now() / 1000)
  });

  return {};
}

/**
 * <Description: Removes a message from a channel or Dm>

 * @param {string} token - Unique token of an authorised user
 * @param {number} messageId - Unique ID for a message

 * @returns {}
 */

export function messageRemoveV2 (token: string, messageId: number) {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);

  // checks if token is valid
  if (userToken === undefined) {
    throw HTTPError(403, 'Error, User token does not exist!');
  }

  // check if valid messages

  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  if (channelIndex === -1 && DmIndex === -1) {
    throw HTTPError(400, 'Error: Message does not exist in channel/dm');
  }

  // checks if it is owner and same user
  if (CheckMessageUser(userToken.authUserId, messageId) === false) {
    throw HTTPError(403, 'Error: User is not an owner or user is not the creator of the message');
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

export function messageSendLaterV1 (token: string, channelId: number, message: string, timeSent: number): {messageId: number} | {error: string} {
  const channel = getChannel(channelId);

  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);
  const currentTime = Math.floor(Date.now() / 1000);

  // Error checking
  if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channel}' does not exist`);
  } else if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist`);
  } else if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Error: The message is either too short (<1) or too long (>1000)');
  } else if (timeSent < currentTime) {
    throw HTTPError(400, 'Error: TimeSent is in the past');
  }

  const checkUserInChannel = channel.allMembers.find(a => a.uId === user.authUserId);
  if (checkUserInChannel === undefined) {
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of the target channel`);
  }

  const messageId = Math.floor(Math.random() * 10000);

  const delay = timeSent - currentTime;

  setTimeout(() => { messageSendV2(token, channel.channelId, message); }, delay);

  return { messageId: messageId };
}

/**
 * <Description: Allows a user to add a reaction to a valid message
 * @param {string} token -  Unique token of an authorised user
 * @param {number} messageId - Unique id for a message
 * @param {number} reactId - Id for a reaction
 */
export function messageReactV1 (token: string, messageId: number, reactId: number) {
  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  // Check if messageId exists in channels or dms
  const DmInd = CheckValidMessageDms(messageId);
  const ChInd = CheckValidMessageChannels(messageId);

  // checks if token is valid
  if (user === undefined) {
    throw HTTPError(403, 'Error, User token does not exist!');
  }
  // if message id does not exist in dm or channel
  if (ChInd === -1 && DmInd === -1) {
    throw HTTPError(400, 'Message Id is not valid');
  }
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid reactId');
  }

  const message = userReacted(user.authUserId, messageId, reactId);

  if (message === false) {
    throw HTTPError(400, 'User has already reacted');
  }

  message.reacts[0].uids.push(user.authUserId);

  return {};
}

/**
 * <Description: Pins a message >
* @param {string} token - Unique token of an authorised user
 * @param {number} messageId - messageId
 * @returns { }
 */

export function messagePinV1(token: string, messageId: any) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);
  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  // checks if token is valid
  if (userToken === undefined) {
    throw HTTPError(403, 'Error: token is invalid');
  }

  // check if message is pinned
  if (checkIsPinned(messageId) === true) {
    throw HTTPError(400, 'Error: Message is already pinned!');
  }

  // check if valid messages
  if (channelIndex === -1 && DmIndex === -1) {
    throw HTTPError(400, 'Error: MessageId doesnt exist!');
  } else if (channelIndex === -1 && DmIndex !== -1) {
    if (!data.dms[DmIndex].members.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the Dm');
    } else if (!data.dms[DmIndex].owners.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in channels');
    }
  } else if (channelIndex !== -1 && DmIndex === -1) {
    if (!data.channels[channelIndex].allMembers.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the channel');
    } else if (!data.channels[channelIndex].ownerMembers.find(x => x.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in dms');
    }
  }

  // In dms
  if (channelIndex === -1) {
    const DmMessageIndex = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);

    data.dms[DmIndex].messages[DmMessageIndex].isPinned = true;
  } else { // in channels
    const channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);

    data.channels[channelIndex].messages[channelMessageIndex].isPinned = true;
  }

  setData(data);
  return {};
}

/**
 * <Description: Unpins a pinned message >
 * @param {string} token - Unique token of an authorised user
 * @param {number} messageId - messageId
 * @returns { }
 */

export function messageUnpinV1(token: string, messageId: any) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const userToken: userType = getToken(tokenHashed);
  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);

  // checks if token is valid
  if (userToken === undefined) {
    throw HTTPError(403, 'Error: token is invalid');
  }

  // check if message is pinned
  if (checkIsUnpinned(messageId) === false) {
    throw HTTPError(400, 'Error: Message is already Unpinned!');
  }

  // check if valid messages
  if (channelIndex === -1 && DmIndex === -1) {
    throw HTTPError(400, 'Error: MessageId doesnt exist!');
  } else if (channelIndex === -1 && DmIndex !== -1) {
    if (!data.dms[DmIndex].members.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the Dm');
    } else if (!data.dms[DmIndex].owners.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in channels');
    }
  } else if (channelIndex !== -1 && DmIndex === -1) {
    if (!data.channels[channelIndex].allMembers.find(user => user.uId === userToken.authUserId)) {
      throw HTTPError(400, 'Error: User is not in the channel');
    } else if (!data.channels[channelIndex].ownerMembers.find(x => x.uId === userToken.authUserId)) {
      throw HTTPError(403, 'Error: Not an owner in dms');
    }
  }

  // In dms
  if (channelIndex === -1) {
    const DmMessageIndex2 = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);

    data.dms[DmIndex].messages[DmMessageIndex2].isPinned = false;
  } else { // in channels
    const channelMessageIndex2 = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);

    data.channels[channelIndex].messages[channelMessageIndex2].isPinned = false;
  }

  setData(data);
  return {};
}

/**
 * <Description: Allows the user to remove their reaction from a message>
 * @param {string} token - Unique token of authorised user
 * @param {number} messageId - unique Id for a message
 * @param {number} reactId - unique id for the type of reaction
 */

export function messageUnreactV1 (token: string, messageId: number, reactId: number) {
  const tokenHashed = getHashOf(token + SECRET);
  const user: userType = getToken(tokenHashed);

  // Check if messageId exists in channels or dms
  const message = messageFinder(messageId);
  // check if user has reacted to message

  if (user === undefined) {
    throw HTTPError(403, 'Error, User token does not exist!');
  }

  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid reactId');
  }

  if (message === false) {
    throw HTTPError(400, 'Invalid Message Id');
  }

  // check if user has reacted
  const check = isUserReacted(user.authUserId, messageId, reactId);

  if (check === false) {
    throw HTTPError(400, 'User reaction does not exist');
  }
  let index;
  for (const reaction of message.reacts) {
    index = reaction.uids.indexOf(user.authUserId);
    reaction.uids.splice(index);
  }

  return {};
}
