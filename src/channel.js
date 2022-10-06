import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';
import { channelsCreateV1 } from './channels.js';

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
        if (data.channels[i.channelId].allMembers[j].authUserId === authUserId) {
          check_inchannel = true;
        }
      }
    };
  }

  if (check_authUserId === false || check_channelId === false || check_inchannel === false) {
    return {error: "error"};
  } else {
    return {
      channel : {
        name: data.users[authUserId].nameFirst,
        isPublic: data.channels[channelId].isPublic,
        ownerMembers: data.channels[channelId].ownerMembers,
        AllMembers: data.channels[channelId].allMembers,
      } 

    };
  }
}


export function channelJoinV1 ( authUserId, channelId ) {
    return {
        
    }
}


export function channelInviteV1( authUserId, channelId ) {

    return {

    }
}


/**
  * If the accessing user is member of the target channel, the function returns an array of messages starting at the provided start and ending at 
  * either start + 50, or earlier if there are less than (start + 50) messages in the channel. 
  * 
  * @param {number} authUserId - The UserId of the user accessing the messages of the channel
  * @param {number} channelId - The target channel from where messages should be recieved
  * @param {number} start - The starting point of returned messages.
  * ...
  * 
  * @returns {{ error: string }} - A string which what error has occured. 
  * @returns {{ messages: array<{ messageId: number, uId: number, message: string, timeSent: number}>, start: number, end: number}} - 
  * Messages array contains all the requested messages, start is the point inputed by the user, and end is either -1 if messages in channel < (start + 50), or 
  * (start + 50), if there are more than 50 messages past the start point.
*/

export function channelMessagesV1 ( authUserId, channelId, start ){

  const data = getData();

  const user = data.users.find(a => a.authUserId === authUserId);
  const channel = data.channels.find(a => a.channelId === channelId);


  if (channel === undefined) {
    return { error: `Channel with channelId '${channel}' does not exist!` };
  } else if (start > channel.messages.length) {
    return { error: `Start '${start}' is greater than the total number of messages in the specified channel`};
  }
  
  const user_in_channel = channel.allMembers.find(a => a.authUserId === authUserId);  
  if (user_in_channel === undefined) {
    return { error: `User with authUserId '${authUserId}' is not a member of channel with channelId '${channel.channelId}'!` };
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