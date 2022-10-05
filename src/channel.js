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