import { getData, setData } from './dataStore.js';

export function channelDetailsV1( authUserId, channelId ) {

  let check_uId = 0 
  let count2 = 0
  let count3 = 0

  if (data.users.find(users => users.uid === authUserId)){
    check_uId = true;
}

  for (let i of dataStore.academic) {
    if (academicId === i.academicId) {
      count += 2;
    } else {
      count++;
    }
  }

  if (dataStore.course.length != 0) {
    for (let j of dataStore.course) {
      if (courseId === j.courseId) {
        for (let i = 0; i < dataStore.course[j.courseId-1].allMembers.length; i++) {
          if (academicId === dataStore.course[j.courseId-1].allMembers[i].academicId) {
            count3 = 1;
          }
        }
      } 
    }
  }

  for (let j of dataStore.academic) {
    if (courseId === j.academicId) {
      count2 += 2;
    } else {
      count2++;
    }
  }

  if (count === dataStore.academic.length || count2 === dataStore.academic.length || count3 === 0) {
    return {error: "error"};
  } else {
    return {
      course: dataStore.course[courseId - 1],
    };
  }

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