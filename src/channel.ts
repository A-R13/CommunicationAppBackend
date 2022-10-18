import { authRegisterV2 } from './auth';
import { channelsCreateV2 } from './channels';
import { getData, setData } from './dataStore';
import { getChannel, getAuthUserId, getUId, getToken } from './other';

/**
 * <Description: function gives the channel details for a existing channel>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {name: name, isPublic: isPublic, ownerMembers:
 * [{ uId, email, nameFirst, nameLast, handleStr}],
 * allMembers: [{uId, email, nameFirst, nameLast, handleStr}]}
 */


export function channelDetailsV2( token : string, channelId : number ) {
  let data = getData();
  let check_channelId = false;
  let check_inchannel = false;

  const userToken = getToken(token)

  if (userToken === undefined) {
      return {error: "error"};
  }

  let userIdentity;

  for (let i in data.users) {
    if (data.users[i].sessions.includes(token) === true) {
      userIdentity = data.users[i].authUserId;
    }
  }

  if (data.channels.find(channels => channels.channelId === channelId)){
    check_channelId = true;

    for (let j in data.channels[channelId].allMembers) {
      if (data.channels[channelId].allMembers[j].uId === userIdentity) {
        check_inchannel = true;
      }
    }

  }

  if (check_channelId === false || check_inchannel === false) {
    return {error: "error"};
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


/*
export function channelJoinV2 ( authUserId, channelId ) {

  const data = getData();

  const user = getAuthUserId(authUserId);
  const channel = getChannel(channelId);

  if (!channel) {
    return { error: `${channelId} does not refer to a valid channel `};
  }

  if (channel.allMembers.find(a => a.uId === authUserId)) {
    return { error: `${authUserId} is already a member of the channel` };
  }

  if (user === undefined) {
    return { error: `${authUserId} is invalid`};
  }
  
  if (channel.isPublic === false && data.users[0] !== user)  { // User 0 is a global owner by default, thus can join any channel 
      return { error: `${channelId} is private, you cannot join this channel`};
  }

  channel.allMembers.push( { email: user.email, handleStr: user.user_handle, nameFirst: user.nameFirst, nameLast: user.nameLast, uId: user.authUserId });

  setData(data);


  return {};
}
*/
/**
 * <Description: Invites a user with ID uId to join channel with ID channelID.
 * Once invited, the user is added to the channel immediately. In both public
 * and private channels, all members are able to invite users.

 * @param {number} authUserId
 * @param {number} channelId
 * @param {number} uId
 * @returns
 */


/*
 export function channelInviteV2 ( authUserId, channelId, uId ) {
  const data = getData();
  const userArray = data.users;
  const channelArray = data.channels;

  const channel = data.channels.find(c => c.channelId === channelId);
  const user1 = getAuthUserId(authUserId);
  const user2 = getUId(uId);

  // checking for invalid channelId, invalid authUserId, invalid uId
  if (channel === undefined || user1 === undefined || user2 === undefined) {
    return {error: 'invalid IDs'};
  }

  // find which index the channel is in
  let i = 0;
  for (const num1 in channelArray) {
    if (channelArray[num1].channelId === channelId) {
      i = num1; // channelId in loops below would be replaced by i;
    }
  }

  // error - uId is already part of the channel
  const allMembersArray = channelArray[i].allMembers;
  for (const num2 in allMembersArray) {
    if (allMembersArray[num2].uId === uId) {
      return {error: 'uId already part of the channel'};
    }
  }

  // error - authUserId is not part of the channel
  let isMember = false;
  if (channelArray[i].allMembers.find(allMembers => allMembers.uId === authUserId)) {
    isMember = true;
  }
  if (isMember === false) {
    return {error: 'authUserId not part of the channel'};
  }

  // no errors, pushing user object to channel
  let j = 0;
  for (const num3 in userArray) {
    if (userArray[num3].authUserId === uId) {
      j = num3;
    }
  }
  const userData = {
    uId: userArray[j].authUserId,
    email: userArray[j].email,
    nameFirst: userArray[j].nameFirst,
    nameLast: userArray[j].nameLast,
    handleStr: userArray[j].user_handle,
  };
  data.channels[channelId].allMembers.push(userData);

  return {};
}
*/
/**
 * <Description: Returns the first 50 messages from a specified channel, given a starting index and given that the accessing user is a member of said channel.
 * If there are less than (start + 50) messages the 'end' value will be -1, to show that there are no more messages to show.

 * @param {number} authUserId
 * @param {number} channelId
 * @param {number} start
 * @returns { messages: [{ messageId, uId, message, timeSent }], start: number, end: number}
 */

export function channelMessagesV2 ( token: string, channelId: number, start: number ){

  const data = getData();

  const userToken = getToken(token);
  // const userId = userToken.authUserId;
  const channel = getChannel(channelId);


  if (channel === undefined) {
    // If channel is undefined
    return { error: `Channel with channelId '${channel}' does not exist!` };
  } else if (start > channel.messages.length) {
    // If the provided start is greater than the total messages in the channel, an error will be returned
    return { error: `Start '${start}' is greater than the total number of messages in the specified channel`};
  }

  if (userToken === undefined) {
    // If user doesn't exist at all, return an error
    return { error: `User with token '${token}' does not exist!` };
  }

  const user_in_channel = channel.allMembers.find(a => a.uId === userToken.authUserId);
  if (user_in_channel === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: `User with authUserId '${userToken.authUserId}' is not a member of channel with channelId '${channel}'!` };
  }  

  if ((start + 50) > channel.messages.length) {
    // If the end value is more than the messages in the channel, set end to -1, to indicate no more messages can be loaded
    return {
      messages: channel.messages.slice(start, channel.messages.length),
      start: start,
      end: -1,
    }
  } else {
    return {
      // If the end value is less than the messages in the channel, set end to (start + 50) to indicate there are still more messages to be loaded
      messages: channel.messages.slice(start, (start + 50)),
      start: start,
      end: (start + 50),
    }
  }
}
