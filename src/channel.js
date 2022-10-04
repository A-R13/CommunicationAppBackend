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
      course: data.channels[channelId],
    };
  }


}

const user1 = authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
const channel1 = channelsCreateV1(user1.authUserId, 'Channel1', true);
console.log(channelDetailsV1(user1.authUserId,user1.authUserId));




export function channelJoinV1 ( authUserId, channelId ) {
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

  /*
  return {
      messages: [
          {
            messageId: 1,
            uId: 1,
            message: 'Hello world',
            timeSent: 1582426789,
          }
        ],
        start: 0,
        end: 50,
  }
  */
}


/*
const messages_54 = [];
for (let i = 1; i < 55; i++) {
    const message = {
        messageId: i,
        uId: 'abc',
        message: `Message ${i}`,
        timeSent: 1000 + i,
    }
    messages_54.unshift(message);
}
console.log(messages_54);

console.log(messages_54.splice(0,50));
console.log(messages_54.splice(50,100));
*/
