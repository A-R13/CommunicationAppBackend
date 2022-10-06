import { authRegisterV1 } from './auth.js';
import { channelsCreateV1 } from './channels.js';
import { getData, setData } from './dataStore.js';

export function channelDetailsV1( authUserId, channelId ) {

    return {
        name: 'Hayden',
        ownerMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
        allMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
      }

}



export function channelJoinV1 ( authUserId, channelId ) {
    return {
        
    }
}


export function channelInviteV1( authUserId, channelId, uId ) {
    const data = getData();
    const userArray = data.users;
    const channelArray = data.channels;
    

    const channel = data.channels.find(c => c.channelId === channelId);
    const user1 = data.users.find(a => a.authUserId === authUserId);
    const user2 = data.users.find(u => u.authUserId === uId);
    

    // invalid channelId, invalid authUserId, invalid uId
    if (channel === undefined || user1 === undefined || user2 === undefined) {
      return {error: 'invalid IDs'};
    }

    /* USE THIS TO GET RID OF CHANNELID = INDEX ASSUMPTION / FIND WHAT INDEX CHANNEL IS IN
    for (const num1 in channelArray) {
      if (channelArray[num1].channelId === channelId) {
        // break
        const i = num1; // channelId in loops below would be replaced by i;
      }
    } */

    // uId is already part of the channel
    // assumes channelId works the same as a counter (0,1,2...) -> channelId = index of array
    const allMembersArray = channelArray[channelId].allMembers;
    for (const num2 in allMembersArray) {
      if (allMembersArray[num2].authUserId === uId) {
        return {error: 'uId already part of the channel'};
      }
    }

    // authUserId is not part of the channel
    // still makes the same assumption as above, is the syntax correct?
    let isMember = false;
    if (channelArray[channelId].allMembers.find(allMembers => allMembers.authUserId === authUserId)) {
      isMember = true;
    }
    if (isMember === false) {
      return {error: 'authUserId not part of the channel'};
    }

    // no errors, pushing the right object to the end of the allMembers array = adding user to channel
    let j = 0;
    for (const num3 in userArray) {
      if (userArray[num3].authUserId === uId) {
        j = num3;
      }
    } 

    const userData = userArray[j];
    data.channels[channelId].allMembers.push(userData);

    return {};
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


const john = authRegisterV1('john.smith@gmail.com', 'password11', 'john', 'smith').authUserId;
const diane = authRegisterV1('diane.phillip@gmail.com', 'password', 'diane', 'phillip').authUserId;
const liam = authRegisterV1('liam.hudge@gmail.com', 'password', 'liam', 'hudge').authUserId;
const channel = channelsCreateV1(john, 'funChannelName', true);
console.log(channelInviteV1(john, channel.channelId, diane));
