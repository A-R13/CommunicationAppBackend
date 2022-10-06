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

const data = getData();
authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
channelsCreateV1(data.users[0].authUserId, 'Channel2', true);
console.log(data.channels)

channelDetailsV1(data.users[0].authUserId, data.channels[1].channelId)



/**
 * <Description: function adds authorised user into a channel they can join>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns does not return anything
 */

//helper function
export function getChannel(channelId) {
  return data.channels.find(c => c.channelId === channelId);
}

export function channelJoinV1 ( authUserId, channelId ) {

  const data = getData();


  const user = data.users.find(a => a.authUserId === authUserId);
  const channel = getChannel(channelId);
  
  if (!channel) {
    return { error: `${channelId} does not refer to a valid channel `};
  }

  if (channel.allMembers.find(a => a.authUserId === authUserId)) {
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

    return {
        
    }
}


export function channelInviteV1( authUserId, channelId ) {

    return {

    }
}

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