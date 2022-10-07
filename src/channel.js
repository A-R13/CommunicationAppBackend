import { authRegisterV1 } from './auth.js';
import { channelsCreateV1 } from './channels.js';
import { getData, setData } from './dataStore.js';
import { getChannel, getAuthUserId, getUId } from './other.js';

/**
 * <Description: function gives the channel details for a existing channel>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {name: name, isPublic: isPublic, ownerMembers: 
 * [{ uId, email, nameFirst, nameLast, handleStr}], 
 * allMembers: [{uId, email, nameFirst, nameLast, handleStr}]}
 */


export function channelDetailsV1( authUserId, channelId ) {
  let data = getData();
  let check_authUserId = false;
  let check_channelId = false;
  let check_inchannel = false;

  if (data.users.find(users => users.authUserId === authUserId)){
    check_authUserId = true;
}

  if (data.channels.find(channels => channels.channelId === channelId)){
    check_channelId = true;
}

  for (let i of data.channels) {
    if (i.channelId === channelId ) {
      for (let j = 0; j < data.channels[i.channelId].allMembers.length; j++) {
        if (data.channels[i.channelId].allMembers[j].uId === authUserId) {
          check_inchannel = true;
        }
      }
    };
  }
  
  if (check_authUserId === false || check_channelId === false || check_inchannel === false) {
    return {error: "error"};
  } else {
    return {
        name: data.channels[channelId].channelName,
        isPublic: data.channels[channelId].isPublic,
        ownerMembers: data.channels[channelId].ownerMembers,
        allMembers: data.channels[channelId].allMembers,
      };
  }
}


/**
 * <Description: function adds authorised user into a channel they can join>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns does not return anything
 */


export function channelJoinV1 ( authUserId, channelId ) {

  const data = getData();


  const user = data.users.find(a => a.authUserId === authUserId);
  const channel = getChannel(channelId);
  
  if (!channel) {
    return { error: `${channelId} does not refer to a valid channel `};
  }

  if (channel.allMembers.find(a => a.uId === authUserId)) {
    return { error: `${authUserId} is already a member of the channel` };
  }

  if (channel.isPublic === false)  {
      return { error: `${channelId} is private, you cannot join this channel`};
  }


  if (user === undefined) { 
    return { error: `${authUserId} is invalid`};
  }

 
  channel.allMembers.push( { authUserId: user.authUserId, User_Handle: user.user_handle }); 

  setData(data);

  return {};
}

/**
 * <Description: Invites a user with ID uId to join channel with ID channelID.
 * Once invited, the user is added to the channel immediately. In both public
 * and private channels, all members are able to invite users.
 
 * @param {number} authUserId 
 * @param {number} channelId 
 * @param {number} uId 
 * @returns 
 */



 export function channelInviteV1( authUserId, channelId, uId ) {
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

/**
 * <Description: Returns the first 50 messages from a specified channel, given a starting index and given that the accessing user is a member of said channel. 
 * If there are less than (start + 50) messages the 'end' value will be -1, to show that there are no more messages to show. 
 
 * @param {number} authUserId 
 * @param {number} channelId 
 * @param {number} start 
 * @returns { messages: [{ messageId, uId, message, timeSent }], start: number, end: number}
 */

export function channelMessagesV1 ( authUserId, channelId, start ){

  const data = getData();

  const user = getAuthUserId(authUserId);
  const channel = getChannel(channelId);


  if (channel === undefined) {
    return { error: `Channel with channelId '${channel}' does not exist!` };
  } else if (start > channel.messages.length) {
    return { error: `Start '${start}' is greater than the total number of messages in the specified channel`};
  }
  
  const user_in_channel = channel.allMembers.find(a => a.uId === authUserId);  
  if (user_in_channel === undefined) {
    return { error: `User with authUserId '${authUserId}' is not a member of channel with channelId '${channel}'!` };
  } else if (user === undefined) {
    return { error: `User with authUserId '${authUserId}' does not exist!` };
  }

  if ((start + 50) > channel.messages.length) {
    return {
      messages: channel.messages.slice(start, channel.messages.length),
      start: start,
      end: -1,
    }
  } else {
    return {
      messages: channel.messages.slice(start, (start + 50)),
      start: start,
      end: (start + 50), 
    }
  }
}




