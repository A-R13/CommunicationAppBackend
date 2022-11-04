import HTTPError from 'http-errors';

import { getData, setData } from './dataStore';
import { channelType, userShort, message, getChannel, getUId, getToken } from './other';

/**
 * <Description: function gives the channel details for a existing channel>
 * @param {number} channelId - unique ID for a channel
 * @param {string} token - unique sesssion token for a user
 * @returns {name: name, isPublic: isPublic, ownerMembers:
 * [{ uId, email, nameFirst, nameLast, handleStr}],
 * allMembers: [{uId, email, nameFirst, nameLast, handleStr}]}
 */

export function channelDetailsV2(token : string, channelId : number) {
  const data = getData();
  let checkInChannel = false;

  const userToken = getToken(token);
  // checks if token is valid
  if (userToken === undefined) {
    return { error: 'Invalid Token' };
  }

  // checks if channel is valid and if user is in channel
  if (getChannel(channelId) === undefined) {
    return { error: 'Channel doesnt exit' };
  } else {
    if (data.channels[channelId].allMembers.find(user => user.uId === userToken.authUserId)) {
      checkInChannel = true;
    }
  }

  if (checkInChannel === false) {
    return { error: 'User isnt in channel' };
  }

  return {
    name: data.channels[channelId].channelName,
    isPublic: data.channels[channelId].isPublic,
    ownerMembers: data.channels[channelId].ownerMembers,
    allMembers: data.channels[channelId].allMembers,
  };
}

/**
 * <Description: function adds authorised user into a channel they can join>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns does not return anything
 */

export function channelJoinV3 (token: string, channelId: number) {
  const data = getData();

  const user = getToken(token);
  const channel = getChannel(channelId);

  if (!channel) {
    throw HTTPError(400,`Error: '${channelId}' does not refer to a valid channel`);
  }

  if (user === undefined) {
    throw HTTPError(403, `Erorr: '${token}' is invalid`);
  }

  if (channel.allMembers.find(a => a.uId === user.authUserId)) {
    throw HTTPError(400, `Error: '${token}' is already a member of the channel`);
  }

  if (channel.isPublic === false && data.users[0] !== user) { // User 0 is a global owner by default, thus can join any channel
    throw HTTPError(403,`Error: '${channelId}' is private, you cannot join this channel`);
  }

  channel.allMembers.push({ email: user.email, handleStr: user.userHandle, nameFirst: user.nameFirst, nameLast: user.nameLast, uId: user.authUserId });

  setData(data);

  return {};
}

/**
 * <Description: Invites a user with ID uId to join channel with ID channelID.
 * Once invited, the user is added to the channel immediately. In both public
 * and private channels, all members are able to invite users.

 * @param {string} token
 * @param {number} channelId
 * @param {number} uId
 * @returns
 */

export function channelInviteV2 (token: string, channelId: number, uId: number) {
  const data = getData();
  const userArray = data.users;
  const channelArray = data.channels;

  const channel = getChannel(channelId);
  const user = getUId(uId);
  const authUserToken = getToken(token);

  // checking for invalid channelId, invalid uId, invalid token
  if (channel === undefined || user === undefined || authUserToken === undefined) {
    return { error: 'invalid parameters' };
  }

  // find which index the channel is in
  let i = 0;
  for (const num1 in channelArray) {
    if (channelArray[num1].channelId === channelId) {
      i = parseInt(num1); // channelId in loops below would be replaced by i;
    }
  }

  // error - uId is already part of the channel
  const allMembersArray = channelArray[i].allMembers;
  for (const num2 in allMembersArray) {
    if (allMembersArray[num2].uId === uId) {
      return { error: 'uId already part of the channel' };
    }
  }

  // error - if the authuser is not a member of the channel, figure out what token really is, what the helper function getToken returns etc.
  const userInChannel = channel.allMembers.find(a => a.uId === authUserToken.authUserId);
  if (userInChannel === undefined) {
    return { error: `User with authUserId '${authUserToken.authUserId}' is not a member of channel with channelId '${channel}'!` };
  }

  // no errors, pushing user object to channel
  let j = 0;
  for (const num3 in userArray) {
    if (userArray[num3].authUserId === uId) {
      j = parseInt(num3);
    }
  }
  const userData = {
    uId: userArray[j].authUserId,
    email: userArray[j].email,
    nameFirst: userArray[j].nameFirst,
    nameLast: userArray[j].nameLast,
    handleStr: userArray[j].userHandle,
  };
  data.channels[channelId].allMembers.push(userData);

  return {};
}

/**
 * <Description: Returns the first 50 messages from a specified channel, given a starting index and given that the accessing user is a member of said channel.
 * If there are less than (start + 50) messages the 'end' value will be -1, to show that there are no more messages to show.

 * @param {string} token
 * @param {number} channelId
 * @param {number} start
 * @returns { messages: [{ messageId, uId, message, timeSent }], start: number, end: number}
 */

export function channelMessagesV3 (token: string, channelId: number, start: number): { messages: message[], start: number, end: number} | { error: string} {
  const userToken = getToken(token);
  const channel: channelType = getChannel(channelId);

  if (channel === undefined) {
    // If channel is undefined
    throw HTTPError(400, `Error: Channel with channelId '${channel}' does not exist!`);
  } else if (start > channel.messages.length) {
    // If the provided start is greater than the total messages in the channel, an error will be returned
    throw HTTPError(400, `Error: Start '${start}' is greater than the total number of messages in the specified channel`);
  }

  if (userToken === undefined) {
    // If user doesn't exist at all, return an error
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${userToken.authUserId}' is not a member of channel with channelId '${channel}'!`);
  }

  if ((start + 50) > channel.messages.length) {
    // If the end value is more than the messages in the channel, set end to -1, to indicate no more messages can be loaded
    return {
      messages: channel.messages.slice(0, channel.messages.length),
      start: start,
      end: -1,
    };
  } else {
    return {
      // If the end value is less than the messages in the channel, set end to (start + 50) to indicate there are still more messages to be loaded
      messages: channel.messages.slice(0, (start + 50)),
      start: start,
      end: (start + 50),
    };
  }
}

/**
 * <Description: Make user with user id uId an owner of the channel.>
 * @param {string} token
 * @param {number} channelId
 * @param {number} uId
 * @returns {{}}
 */
export function addOwnerV1 (token: string, channelId: number, uId: number) {
  const data = getData();
  const channel = getChannel(channelId);
  const user = getUId(uId);
  const authUserToken = getToken(token);

  // ERROR CASES
  // checking for invalid channelId, invalid uId, invalid token
  if (channel === undefined || user === undefined || authUserToken === undefined) {
    return { error: 'invalid parameters' };
  }

  // uId refers to a user who is not a member of the channel
  const channelIndex = data.channels.findIndex(c => c.channelId === channelId);

  // method 1
  if (!data.channels[channelIndex].allMembers.find(x => x.uId === uId)) {
    return { error: 'uId is not an owner of the channel' };
  }

  // uId refers to a user who is already an owner of the channel
  if (data.channels[channelIndex].ownerMembers.find(x => x.uId === uId)) {
    return { error: 'uId is already an owner of the channel' };
  }

  // authorised user does not have owner permissions in the channel
  const userIsOwner = data.channels[channelIndex].ownerMembers.find(x => x.uId === authUserToken.authUserId);
  if (userIsOwner === undefined) {
    return { error: `User with authUserId '${authUserToken.authUserId}' is not an owner of channel with channelId '${channel}'!` };
  }

  // SUCCESS CASE - add user an owner of the channel
  // finding the right index uid belongs to in user array
  const userArray = data.users;
  let index;
  for (const num in userArray) {
    if (userArray[num].authUserId === uId) {
      index = num;
    }
  }

  // initialising keys specific to uid
  const userData = {
    uId: userArray[index].authUserId,
    email: userArray[index].email,
    nameFirst: userArray[index].nameFirst,
    nameLast: userArray[index].nameLast,
    handleStr: userArray[index].userHandle,
  };

  // push the data
  data.channels[channelIndex].ownerMembers.push(userData);

  return {};
}

/**
 * <Description: Remove user with user id uId as an owner of the channel.>
 *
 * @param {string} token
 * @param {number} channelId
 * @param {number} uId
 * @returns {{}}
 */

export function removeOwnerV1 (token: string, channelId: number, uId: number) {
  const data = getData();
  const channel = getChannel(channelId);
  const user = getUId(uId);
  const authUserToken = getToken(token);

  // ERROR CASES

  // checking for invalid channelId, invalid uId, invalid token
  if (channel === undefined || user === undefined || authUserToken === undefined) {
    return { error: 'invalid parameters' };
  }

  // uid is not an owner of the channel
  const channelIndex = data.channels.findIndex(c => c.channelId === channelId);

  if (!data.channels[channelIndex].ownerMembers.find(x => x.uId === uId)) {
    return { error: 'uId is not an owner of the channel' };
  }

  // uid is the only owner of the channel
  const userIndex = data.channels[channelIndex].ownerMembers.findIndex(x => x.uId === uId);
  if (userIndex === 0) {
    return { error: 'uId is the only owner of the channel' };
  }

  // authUser which the token belongs to, is not an owner
  const userIsOwner = data.channels[channelIndex].ownerMembers.find(x => x.uId === authUserToken.authUserId);
  if (userIsOwner === undefined) {
    return { error: `User with authUserId '${authUserToken.authUserId}' is not an owner of channel with channelId '${channel}'!` };
  }

  // SUCCESS CASE
  // remove uid from ownerMembers array
  data.channels[channelIndex].ownerMembers.splice(userIndex, 1);

  return {};
}

/**
 * <Description: Removes a user from a channel.>
 *
 * @param {string} token
 * @param {number} channelId
 * @returns {{}}
 */

export function channelleaveV1(token : string, channelId : number) {
  const data = getData();

  let checkChannelId = false;
  let checkInChannel = false;

  const userToken = getToken(token);

  // Checks if token is valid
  if (userToken === undefined) {
    return { error: 'error from invalid token' };
  }

  // Checks if valid channelId and if the user is in the channel
  if (data.channels.find(channels => channels.channelId === channelId)) {
    checkChannelId = true;

    if (data.channels[channelId].allMembers.find(user => user.uId === userToken.authUserId)) {
      checkInChannel = true;
    }
  }
  // If not in channel or channel isnt real, return error. Else, remove the member from channel.
  if (checkChannelId === false || checkInChannel === false) {
    return { error: 'Error from false channelId or not in channel' };
  } else {
    data.channels[channelId].ownerMembers = data.channels[channelId].ownerMembers.filter(member => member.uId !== userToken.authUserId);
    data.channels[channelId].allMembers = data.channels[channelId].allMembers.filter(member => member.uId !== userToken.authUserId);
  }
  // set data and return nothing
  setData(data);

  return {};
}
